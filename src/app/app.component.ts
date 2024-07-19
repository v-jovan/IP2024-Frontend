import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SearchHeaderComponent } from './components/search-header/search-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, SearchHeaderComponent]
})
export class AppComponent implements OnInit {
  title = 'IP2024Frontend';
  doNotShowHeaderOn = ['checkout', 'register', 'dashboard']; // Paths where header should not be shown
  showHeader = true;

  constructor(private router: Router) {}

  /**
   * Initializes the component and subscribes to router events to determine whether to hide the header or not.
   */
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !this.shouldHideHeader(event.url); // Determine whether to hide header or not
      }
    });
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
