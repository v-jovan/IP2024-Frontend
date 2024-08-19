import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from '@components/login/login.component';
import { CartComponent } from '@components/cart/cart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { UserService } from 'src/app/services/User/user.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { SidebarModule } from 'primeng/sidebar';

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
    AvatarModule,
    AvatarGroupModule,
    DialogModule,
    SidebarModule
  ]
})
export class SearchHeaderComponent implements OnInit {
  userIsLoggedIn: boolean = false;
  userMenuItems: MenuItem[] | undefined;
  userAvatar: string | undefined;
  userNotActivated: boolean = false;
  resendLabel: string = 'Pošalji ponovo';
  buttonDisabled: boolean = false;
  isDesktopToolbar: boolean = true;
  mobileSidebarVisible: boolean = false;
  userName: string | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private tokenService: TokenStoreService,
    private userService: UserService,
    private errorInterceptor: ErrorInterceptorService,
    private authService: AuthService
  ) {}

  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  async ngOnInit() {
    this.checkWindowWidth();
    if (this.tokenService.isLoggedIn()) {
      await this.setAvatar();
      if (!this.isDesktopToolbar) {
        this.setMobileUsername();
      }
    }
    this.route.queryParams.subscribe((params) => {
      if (params['activated'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Nalog aktiviran',
          detail: 'Uspješno ste aktivirali nalog. Sada se možete prijaviti.'
        });
        this.loginComponent.showDialog();
      }
    });

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

    this.userIsLoggedIn = this.tokenService.isLoggedIn();
  }
  setMobileUsername() {
    this.userName = this.tokenService.getUserSubject();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  openLoginDialog() {
    this.loginComponent.showDialog();
  }

  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.tokenService.clearToken();
    this.userIsLoggedIn = false;
    this.mobileSidebarVisible = false;
  }

  async onLoginSuccess() {
    this.userIsLoggedIn = true;
    this.mobileSidebarVisible = false;
    this.setMobileUsername();
    await this.setAvatar();
    await this.checkUserActivation();
  }

  async setAvatar() {
    try {
      this.userAvatar = await this.userService.getAvatar();
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    }
  }

  async checkUserActivation() {
    try {
      this.userNotActivated =
        !((await this.userService.isUserActive()) as boolean);
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    }
  }

  resendActivationEmail() {
    try {
      this.authService.resendActivationEmail();
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    }

    this.buttonDisabled = true;
    let coundown = 30;

    const interval = setInterval(() => {
      coundown--;
      this.resendLabel = `Pošalji ponovo (${coundown})`;
      if (coundown === 0) {
        clearInterval(interval);
        this.checkUserActivation();
        this.resendLabel = 'Pošalji ponovo';
        this.buttonDisabled = false;
      }
    }, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkWindowWidth();
  }
  checkWindowWidth(): void {
    this.isDesktopToolbar = window.innerWidth > 800;
  }
}
