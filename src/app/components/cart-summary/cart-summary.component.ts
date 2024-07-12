import { Component } from '@angular/core';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'cart-summary',
  standalone: true,
  imports: [],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  currency = 'USD';
  cartItems: CartItem[] = [
    { name: 'Product 1', quantity: 2, price: 29.99 },
    { name: 'Product 2', quantity: 1, price: 49.99 },
    { name: 'Product 3', quantity: 3, price: 19.99 }
  ];

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0.0);
  }
}
