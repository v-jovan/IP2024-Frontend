import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SearchHeaderComponent } from './components/search-header/search-header.component';
import { LoaderComponent } from '@components/util/loader/loader.component';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    SearchHeaderComponent,
    ToastModule,
    LoaderComponent,
    CommonModule
  ]
})
export class AppComponent implements OnInit {
  title = 'IP2024Frontend';
  doNotShowHeaderOn = ['checkout', 'register', 'dashboard']; // Paths where header should not be shown
  showHeader = true;

  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) {}

  /**
   * Initializes the component and subscribes to router events to determine whether to hide the header or not.
   */
  ngOnInit(): void {
    this.primengConfig.ripple = true; // Enable ripple effect for PrimeNG components
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !this.shouldHideHeader(event.url); // Determine whether to hide header or not
      }
    });
  }

  isDashboard(): boolean {
    return this.router.url.startsWith('/dashboard');
  }

  /**
   * Determines whether the header should be hidden based on the given URL.
   * @param url - The URL to check.
   * @returns A boolean value indicating whether the header should be hidden.
   */
  private shouldHideHeader(url: string): boolean {
    return this.doNotShowHeaderOn.some((path) => url.includes(path));
  }
}
