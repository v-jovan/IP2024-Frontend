import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';

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
    BreadcrumbModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  isSidebarHidden = false;
  breadcrumbItems: MenuItem[] | undefined;
  home: MenuItem | undefined;
  userMenuItems: MenuItem[] = [];
  sidebarItems: MenuItem[] = [];

  @ViewChild('userMenu') userMenu: Menu | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.userMenuItems = [
      {
        label: 'Podešavanja',
        icon: 'pi pi-cog',
        command: () => this.goToSettings()
      },
      { label: 'Odjava', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
    this.sidebarItems = [
      {
        label: 'Programi',
        icon: 'pi pi-fw pi-folder',
        items: [
          {
            label: 'Pregled programa',
            icon: 'pi pi-fw pi-list',
            command: () => this.viewPrograms()
          },
          {
            label: 'Kreiraj novi program',
            icon: 'pi pi-fw pi-plus',
            command: () => this.createProgram()
          }
        ]
      },
      {
        label: 'Korisnik',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Dnevnik rada',
            icon: 'pi pi-fw pi-book',
            command: () => this.viewDiary()
          },
          {
            label: 'Statistika rada',
            icon: 'pi pi-fw pi-chart-line',
            command: () => this.viewStatistics()
          }
        ]
      },
      {
        label: 'Korisnik',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Dnevnik rada',
            icon: 'pi pi-fw pi-book',
            command: () => this.viewDiary()
          },
          {
            label: 'Statistika rada',
            icon: 'pi pi-fw pi-chart-line',
            command: () => this.viewStatistics()
          }
        ]
      },
      {
        label: 'Korisnik',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Dnevnik rada',
            icon: 'pi pi-fw pi-book',
            command: () => this.viewDiary()
          },
          {
            label: 'Statistika rada',
            icon: 'pi pi-fw pi-chart-line',
            command: () => this.viewStatistics()
          }
        ]
      },
      {
        label: 'Korisnik',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Dnevnik rada',
            icon: 'pi pi-fw pi-book',
            command: () => this.viewDiary()
          },
          {
            label: 'Statistika rada',
            icon: 'pi pi-fw pi-chart-line',
            command: () => this.viewStatistics()
          }
        ]
      }
    ];
    this.breadcrumbItems = [
      { label: 'Electronics' },
      { label: 'Computer' },
      { label: 'Accessories' },
      { label: 'Keyboard' },
      { label: 'Wireless' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  viewPrograms(): void {
    throw new Error('Method not implemented.');
  }
  createProgram(): void {
    throw new Error('Method not implemented.');
  }
  viewDiary(): void {
    throw new Error('Method not implemented.');
  }
  viewStatistics(): void {
    throw new Error('Method not implemented.');
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  goToSettings(): void {
    // Implementiraj logiku za odlazak na stranicu za podešavanje naloga
  }

  logout(): void {
    // Implementiraj logout logiku
  }
  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
