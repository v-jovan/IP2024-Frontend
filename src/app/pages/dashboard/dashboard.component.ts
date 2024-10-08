import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/User/user.service';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    CommonModule,
    MenuModule,
    BreadcrumbModule,
    SidebarModule,
    UserAvatarComponent
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
    private userService: UserService
  ) {}

  async ngOnInit() {
    try {
      this.userAvatar = await this.userService.getAvatar();
    } catch (error) {}
    this.userMenuItems = [
      {
        id: 'profile',
        label: 'Profil',
        icon: 'pi pi-user',
        command: () => this.goToSidebarItem('profile')
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
            command: () => this.goToSidebarItem('view-programs')
          },
          {
            id: 'create-program',
            label: 'Kreiraj novi program',
            icon: 'pi pi-fw pi-plus',
            command: () => this.goToSidebarItem('create-program')
          },
          {
            id: 'purchased-programs',
            label: 'Kupljeni programi',
            icon: 'pi pi-fw pi-shopping-cart',
            command: () => this.goToSidebarItem('purchased-programs')
          }
        ]
      },
      {
        id: 'training',
        label: 'Trening',
        items: [
          {
            id: 'daily-exercise',
            label: 'Dnevne vježbe',
            icon: 'pi pi-fw pi-calendar',
            command: () => this.goToSidebarItem('daily-exercise')
          },
          {
            id: 'diary',
            label: 'Dnevnik',
            icon: 'pi pi-fw pi-book',
            command: () => this.goToSidebarItem('diary')
          },
          {
            id: 'statistics',
            label: 'Statistika',
            icon: 'pi pi-fw pi-chart-bar',
            command: () => this.goToSidebarItem('statistics')
          }
        ]
      },
      {
        id: 'user',
        label: 'Korisnik',
        items: [
          {
            id: 'profile',
            label: 'Informacije',
            icon: 'pi pi-fw pi-user',
            command: () => this.goToSidebarItem('profile')
          },
          {
            id: 'password',
            label: 'Lozinka',
            icon: 'pi pi-fw pi-lock',
            command: () => this.goToSidebarItem('password')
          },
          {
            id: 'subscription',
            label: 'Pretplate',
            icon: 'pi pi-fw pi-calendar-clock',
            command: () => this.goToSidebarItem('subscription')
          }
        ]
      },
      {
        id: 'contact',
        label: 'Kontakt',
        items: [
          {
            id: 'contact',
            label: 'Poruke',
            icon: 'pi pi-fw pi-inbox',
            command: () => this.goToSidebarItem('contact')
          },
          {
            id: 'adviser-contact',
            label: 'Savjetnici',
            icon: 'pi pi-fw pi-question-circle',
            command: () => this.goToSidebarItem('adviser-contact')
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
    this.isDesktopSidebar = window.innerWidth > 1200;
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
  goToSidebarItem(item: string): void {
    this.router.navigate([`dashboard/${item}`]);
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

  navigateHome() {
    this.router.navigate(['/home']);
  }

  navigateToInbox() {
    this.router.navigate(['/dashboard/contact']);
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
