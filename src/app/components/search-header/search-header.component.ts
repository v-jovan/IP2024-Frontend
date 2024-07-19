import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from "@components/login/login.component";
import { CartComponent } from "@components/cart/cart.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-search-header',
    standalone: true,
    templateUrl: './search-header.component.html',
    styleUrl: './search-header.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [InputTextModule, FormsModule, ToolbarModule, ButtonModule, LoginComponent, CartComponent]
})
export class SearchHeaderComponent implements OnInit {
  value!: string;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.value = '';
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
