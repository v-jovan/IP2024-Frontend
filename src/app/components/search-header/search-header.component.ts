import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  AutoCompleteModule,
  AutoCompleteSelectEvent,
  AutoCompleteCompleteEvent
} from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from '@components/login/login.component';
import { CartComponent } from '@components/cart/cart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { DialogModule } from 'primeng/dialog';
import { UserService } from 'src/app/services/User/user.service';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { LoginService } from 'src/app/services/LoginForm/login.service';
import { CurrencyPipe } from '@angular/common';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { TreeModule } from 'primeng/tree';
import { Category } from 'src/app/interfaces/misc/category';
import { Attribute } from 'src/app/interfaces/misc/attribute';
import { AttributeValue } from 'src/app/interfaces/misc/attribute-value';
import { SidebarService } from 'src/app/services/FilterSidebar/sidebar.service';
import { UrlPipe } from '../../pipes/url.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-search-header',
  standalone: true,
  templateUrl: './search-header.component.html',
  styleUrl: './search-header.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    AutoCompleteModule,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    LoginComponent,
    CartComponent,
    MenuModule,
    DialogModule,
    CurrencyPipe,
    UserAvatarComponent,
    TreeModule,
    UrlPipe,
    InputTextModule,
    PasswordModule
  ]
})
export class SearchHeaderComponent implements OnInit {
  categories!: TreeNode[];
  selectedNode: TreeNode | null = null;

  // User related
  userIsLoggedIn: boolean = false;
  userMenuItems: MenuItem[] | undefined;
  userAvatar: string | undefined;
  userNotActivated: boolean = false;
  userFullName: string | undefined;
  username: string | undefined;
  password: string | undefined;
  userSecondTimeLoggedIn: boolean = false;

  // UI related
  isDesktopToolbar: boolean = true;
  mobileSidebarVisible: boolean = false;

  // Activation mail related
  resendLabel: string = 'Pošalji ponovo';
  buttonDisabled: boolean = false;

  // Fitness program related
  fitnessPrograms: FitnessProgram[] = [];
  selectedFitnessProgram: FitnessProgram | undefined;
  filteredFitnessPrograms: FitnessProgram[] = [];

  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private tokenService: TokenStoreService,
    private userService: UserService,
    private authService: AuthService,
    private fitnessProgramService: FitnessProgramService,
    private loginService: LoginService,
    private sidebarService: SidebarService
  ) {}

  async ngOnInit() {
    this.subscribeToLoginEvents();
    this.filteredFitnessPrograms = [];

    this.checkWindowWidth();
    if (this.tokenService.isLoggedIn()) {
      await this.setAvatar();
      if (!this.isDesktopToolbar) {
        this.setMobileUsername();
      }
    }
    this.checkQueryParams();
    await this.loadPrograms();
    this.initUserMenuItems();
    this.userIsLoggedIn = this.tokenService.isLoggedIn();
    if (this.userIsLoggedIn) {
      await this.checkUserActivation();
    }
  }

  // User related methods
  private initUserMenuItems() {
    this.userMenuItems = [
      {
        label: 'Korisnički panel',
        icon: 'pi pi-cog',
        command: () => this.goToDashboard()
      },
      {
        label: 'Profil',
        icon: 'pi pi-user',
        command: () => this.goToProfile()
      },
      { label: 'Odjava', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }

  private subscribeToLoginEvents() {
    this.loginService.loginRequested$.subscribe(() => {
      this.openLoginDialog();
    });
  }

  private checkQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (params['activated'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Nalog aktiviran',
          detail: 'Uspješno ste aktivirali nalog!'
        });
        this.loginComponent.showDialog();
      }
    });
  }

  private async setAvatar() {
    try {
      this.userAvatar = await this.userService.getAvatar();
    } catch (error) {}
  }

  private setMobileUsername() {
    this.userFullName = this.tokenService.getUserSubject();
  }

  async login() {
    if (this.username?.trim() !== this.tokenService.getUserSubject()) {
      this.userSecondTimeLoggedIn = false;
      this.username = '';
      this.password = '';
      this.messageService.add({
        severity: 'error',
        summary: 'Greška',
        detail: 'Unesite ispravne kredencijale.'
      });
      return;
    }
    const loginData = {
      emailOrUsername: this.username,
      password: this.password
    };
    try {
      const response = await this.authService.login(loginData);
      if (response) {
        this.userSecondTimeLoggedIn = true;
        this.resendActivationEmail();
      }
    } finally {
      this.username = '';
      this.password = '';
    }
  }

  logout() {
    this.userIsLoggedIn = false;
    this.mobileSidebarVisible = false;
    this.authService.logout();
  }

  async onLoginSuccess() {
    this.userIsLoggedIn = true;
    this.mobileSidebarVisible = false;
    this.setMobileUsername();
    await this.setAvatar();
    await this.checkUserActivation();
  }

  async checkUserActivation() {
    try {
      this.userNotActivated =
        !((await this.userService.isUserActive()) as boolean);
    } catch (error) {}
  }

  resendActivationEmail() {
    try {
      this.authService.resendActivationEmail();
    } catch (error) {}

    this.buttonDisabled = true;
    let countdown = 30;

    const interval = setInterval(() => {
      countdown--;
      this.resendLabel = `Pošalji ponovo (${countdown})`;
      if (countdown === 0) {
        clearInterval(interval);
        this.checkUserActivation();
        this.resendLabel = 'Pošalji ponovo';
        this.buttonDisabled = false;
      }
    }, 1000);
  }

  get loginButtonDisabled() {
    return !this.username || !this.password;
  }

  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Fitness program related methods
  filterFitnessProgram(event: AutoCompleteCompleteEvent) {
    let filtered: FitnessProgram[] = [];
    let query = event.query;
    for (let i = 0; i < this.fitnessPrograms.length; i++) {
      let program = this.fitnessPrograms[i];
      if (program.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(program);
      }
    }
    this.filteredFitnessPrograms = filtered;
  }

  async loadPrograms() {
    try {
      const response = await this.fitnessProgramService.getAllPrograms({
        page: 0,
        size: 1000
      });
      this.fitnessPrograms = response.content;
    } catch (error) {}
  }

  async loadFilter() {
    try {
      const categories =
        await this.fitnessProgramService.getCategoriesWithAttributes();
      this.categories = categories.map((category: Category) => ({
        label: category.name,
        key: category.id,
        expanded: true,
        data: {
          categoryId: category.id,
          attributeId: null,
          attributeValueId: null
        },
        children: category.attributes.map((attribute: Attribute) => ({
          label: attribute.name,
          data: {
            categoryId: category.id,
            attributeId: attribute.id,
            attributeValueId: null
          },
          children: attribute.values.map((value: AttributeValue) => ({
            label: value.name,
            data: {
              categoryId: category.id,
              attributeId: attribute.id,
              attributeValueId: value.id
            }
          }))
        }))
      }));
    } catch (error) {}
  }

  goToDetails(event: AutoCompleteSelectEvent) {
    this.router.navigate(['/program-details/' + event.value.id]);
  }

  clearSearch() {
    this.selectedFitnessProgram = undefined;
  }

  openLoginDialog() {
    this.loginComponent.showDialog();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    this.isDesktopToolbar = window.innerWidth > 820;
  }

  openSidebar() {
    this.sidebarService.setSidebarVisibility(true);
  }
}
