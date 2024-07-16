import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface CartItem {
  name: string;
  price: number;
}

@Component({
  selector: 'cart-summary',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  currency = 'USD';
  cartItems: CartItem[] = [
    { name: 'Product 1', price: 29.99 },
    { name: 'Product 2', price: 49.99 },
    { name: 'Product 3', price: 19.99 }
  ];

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0.0);
  }
}
