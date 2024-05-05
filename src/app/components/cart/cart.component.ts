import { Component, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { CartItem } from '../../../models/interfaces';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ButtonModule, SidebarModule, CardModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CartComponent {
  sidebarVisible: boolean = false;
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      imgURL: 'https://placehold.co/200x150'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200,
      imgURL: 'https://placehold.co/200x150'
    },
    {
      id: 3,
      name: 'Product 3',
      price: 300,
      imgURL: 'https://placehold.co/200x150'
    }
  ];

  showCart() {
    this.sidebarVisible = true;
  }
  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
  }
  order() {
    alert('Order placed successfully');
  }
  get total(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }
  get numberOfItems(): string {
    if (this.cartItems.length === 0) return '';
    return this.cartItems.length.toString();
  }
}
