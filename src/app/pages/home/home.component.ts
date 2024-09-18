import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHeaderComponent } from '@components/search-header/search-header.component';
import { FilterMenuComponent } from '../../components/filter-menu/filter-menu.component';
import { ProgramCardComponent } from '../../components/program-card/program-card.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { UserService } from 'src/app/services/User/user.service';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { UserProgramResponse } from 'src/app/interfaces/responses/user-program-response';
import { ProgramStatus } from 'src/app/enums/program-status';
import { OrderService } from 'src/app/services/Order/order.service';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from 'src/app/services/FilterSidebar/sidebar.service';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    FormsModule,
    SearchHeaderComponent,
    FilterMenuComponent,
    ProgramCardComponent,
    PaginatorModule,
    SidebarModule,
    ButtonModule,
    UserAvatarComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  // Data related to programs
  programs: FitnessProgram[] = [];
  totalRecords: number = 0;

  // Pagination settings
  first: number = 0;
  rows: number = 9;

  // Selected filters (category, attribute, value)
  selectedCategoryId: number | null = null;
  selectedAttributeId: number | null = null;
  selectedAttributeValueId: number | null = null;

  // User-related data
  myId: number = 0;
  userAvatar: string | undefined;
  userIsLoggedIn: boolean = this.tokenStoreService.isLoggedIn();
  userName: string | undefined;

  // Sidebar and mobile view handling
  mobileSidebarVisible: boolean = false;
  isMobile: boolean = false;

  constructor(
    private fitnessProgramService: FitnessProgramService,
    private orderService: OrderService,
    private loaderService: LoaderService,
    private userService: UserService,
    private tokenStoreService: TokenStoreService,
    private sidebarService: SidebarService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.checkIfMobile(); // Detect mobile/desktop view
    this.listenToSidebarChanges(); // Set up sidebar visibility changes
    await this.loadUserData(); // Load user data and programs
  }

  // Detect window resize and check if the view is mobile
  @HostListener('window:resize', [])
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 820;
  }

  // Subscribe to changes in sidebar visibility
  private listenToSidebarChanges() {
    this.sidebarService.sidebarVisibility$.subscribe(async (isVisible) => {
      this.mobileSidebarVisible = isVisible;
      if (this.userIsLoggedIn) {
        await this.setAvatar(); // Load user avatar if logged in
        this.userName = this.tokenStoreService.getUserSubject() || '';
      }
    });
  }

  // Load user data and purchased programs
  private async loadUserData() {
    this.loaderService.show();

    if (this.isLoggedIn) {
      this.myId = await this.userService.getUserId();
      const purchasedPrograms = await this.loadPurchasedPrograms(); // Load purchased programs
      await this.loadPrograms(purchasedPrograms); // Load fitness programs and mark purchased
    } else {
      await this.loadPrograms([]); // Load fitness programs without purchased info
    }

    this.loaderService.hide();
  }

  // Load purchased programs
  private async loadPurchasedPrograms(): Promise<UserProgramResponse[]> {
    try {
      const response = await this.orderService.getPurchasedPrograms({
        page: 0,
        size: 100
      });
      return response.content;
    } catch (error) {
      return [];
    }
  }

  // Load fitness programs and mark the purchased ones
  private async loadPrograms(purchasedPrograms: UserProgramResponse[]) {
    const params = {
      page: this.first / this.rows,
      size: this.rows,
      categoryId: this.selectedCategoryId,
      attributeId: this.selectedAttributeId,
      attributeValueId: this.selectedAttributeValueId
    };

    try {
      const response = await this.fitnessProgramService.getAllPrograms(params);
      this.programs = response.content;
      this.programs = this.programs.map((program) => ({
        ...program,
        isPurchased: purchasedPrograms.some(
          (purchased) =>
            purchased.id === program.id &&
            purchased.status === ProgramStatus.ACTIVE
        )
      }));
      this.totalRecords = response.totalElements;
    } catch (error) {}
  }

  // Event handler for pagination change
  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.loadPrograms([]);
  }

  // Event handler for filter change
  onFilterChanged(filterData: {
    categoryId: number;
    attributeId: number | null;
    attributeValueId: number | null;
  }) {
    this.selectedCategoryId = filterData.categoryId;
    this.selectedAttributeId = filterData.attributeId;
    this.selectedAttributeValueId = filterData.attributeValueId;
    this.first = 0; // Reset to first page on filter change
    this.loadPrograms([]);
  }

  // Check if user is logged in
  get isLoggedIn(): boolean {
    return this.tokenStoreService.isLoggedIn();
  }

  // Load user avatar
  private async setAvatar() {
    try {
      this.userAvatar = await this.userService.getAvatar();
    } catch (error) {}
  }

  // Log the user out
  logout() {
    this.userIsLoggedIn = false;
    this.mobileSidebarVisible = false;
    this.authService.logout();
  }

  // Navigate to profile page
  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
