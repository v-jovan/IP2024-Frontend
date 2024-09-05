import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { CartItem } from 'src/app/interfaces/misc/cart-item';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'cart-summary',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartStoreService: CartStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartStoreService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
    if (this.cartItems.length === 0) {
      this.redirectTotHome();
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0.0);
  }

  removeFromCart(item: CartItem) {
    this.cartStoreService.removeFromCart(item.id);
    if (this.cartItems.length === 0) {
      this.redirectTotHome();
    }
  }

  redirectTotHome() {
    this.router.navigate(['/']);
  }
}
