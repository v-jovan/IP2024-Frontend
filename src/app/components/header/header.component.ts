import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from "../login/login.component";
import { CartComponent } from "../cart/cart.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [InputTextModule, FormsModule, ToolbarModule, ButtonModule, LoginComponent, CartComponent]
})
export class HeaderComponent implements OnInit {
  value!: string;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.value = '';
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
