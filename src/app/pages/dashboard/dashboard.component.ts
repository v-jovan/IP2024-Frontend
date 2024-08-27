import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/User/user.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    AvatarGroupModule,
    CommonModule,
    MenuModule,
    BreadcrumbModule,
    SidebarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  isSidebarHidden = false;
  isDesktopSidebar: boolean = true;
  mobileSidebar: boolean = false;
  breadcrumbItems: MenuItem[] | undefined;
  home: MenuItem | undefined;
  userMenuItems: MenuItem[] | undefined;
  sidebarItems: MenuItem[] | undefined;
  selectedSidebarItem: string | null = null;
  userAvatar: string | undefined;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private errorInterceptor: ErrorInterceptorService
  ) {}

  async ngOnInit() {
    try {
      this.userAvatar = await this.userService.getAvatar();
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    }
    this.userMenuItems = [
      {
        label: 'Profil',
        icon: 'pi pi-user',
        command: () => this.goToProfile()
      },
      { label: 'Odjava', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
    this.sidebarItems = [
      {
        id: 'programs',
        label: 'Programi',
        items: [
          {
            id: 'view-programs',
            label: 'Pregled programa',
            icon: 'pi pi-fw pi-list',
            command: () => this.viewPrograms()
          },
          {
            id: 'create-program',
            label: 'Kreiraj novi program',
            icon: 'pi pi-fw pi-plus',
            command: () => this.createProgram()
          }
        ]
      },
      {
        id: 'user',
        label: 'Korisnik',
        items: [
          {
            id: 'daily-exercise',
            label: 'Dnevne vježbe',
            icon: 'pi pi-fw pi-calendar',
            command: () => this.viewDailyExercise()
          },
          {
            id: 'profile',
            label: 'Informacije',
            icon: 'pi pi-fw pi-user',
            command: () => this.goToProfile()
          },
          {
            id: 'password',
            label: 'Lozinka',
            icon: 'pi pi-fw pi-lock',
            command: () => this.gotToPassword()
          }
        ]
      }
    ];
    this.home = {
      icon: 'pi pi-home',
      routerLink: '/dashboard',
      command: () => {
        this.breadcrumbItems = undefined;
      }
    };

    // Make all checks and update the sidebar/breadcrumb
    this.checkWindowWidth();
    this.updateSelectedSidebarItem(this.router.url);
    this.updateBreadcrumb();

    // Subscribe to router events
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.updateSelectedSidebarItem(url);
        this.updateBreadcrumb();
        if (!this.isDesktopSidebar) {
          this.closeCallback(new Event('click'));
        }
      });
  }
  viewDailyExercise(): void {
    this.router.navigate(['dashboard/daily-exercise']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkWindowWidth();
  }
  checkWindowWidth(): void {
    this.isDesktopSidebar = window.innerWidth > 1060;
  }

  gotToPassword(): void {
    this.router.navigate(['dashboard/password']);
  }

  goToProfile(): void {
    this.router.navigate(['dashboard/profile']);
  }

  createProgram(): void {
    this.router.navigate(['dashboard/create-program']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  selectSidebarItem(id: string) {
    this.selectedSidebarItem = id;
  }

  updateBreadcrumb() {
    const item = this.sidebarItems
      ?.flatMap((group) => group.items)
      .find((subItem) => subItem?.id === this.selectedSidebarItem);
    if (item) {
      this.breadcrumbItems = [{ label: item.label }];
    }
  }

  updateSelectedSidebarItem(url: string) {
    const segments = url.split('/');
    const dashboardIndex = segments.indexOf('dashboard');
    if (dashboardIndex !== -1 && segments[dashboardIndex + 1]) {
      this.selectedSidebarItem = segments[dashboardIndex + 1];
      return;
    } else {
      this.selectedSidebarItem = null;
    }
  }

  viewPrograms(): void {
    console.log('viewPrograms');
  }
  viewDiary(): void {
    console.log('viewDiary');
  }
  viewStatistics(): void {
    console.log('viewStatistics');
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
  }
  toggleSidebar() {
    if (this.isDesktopSidebar) {
      this.isSidebarHidden = !this.isSidebarHidden;
    } else {
      this.mobileSidebar = !this.mobileSidebar;
    }
  }

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }
}
