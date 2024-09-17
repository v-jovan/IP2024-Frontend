import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { CartItem } from 'src/app/interfaces/misc/cart-item';
import { BadgeModule } from 'primeng/badge';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { UrlPipe } from "../../pipes/url.pipe";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ButtonModule, SidebarModule, CardModule, BadgeModule, CurrencyPipe, UrlPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {
  sidebarVisible: boolean = false;
  cartItems: CartItem[] = [];

  constructor(
    private router: Router,
    private cartStoreService: CartStoreService
  ) {}

  ngOnInit(): void {
    this.cartStoreService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  get numberOfItems(): number {
    return this.cartItems.length;
  }

  get total(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  removeFromCart(id: number): void {
    this.cartStoreService.removeFromCart(id);
  }

  showCart() {
    this.sidebarVisible = true;
  }

  order() {
    this.sidebarVisible = false;
    this.router.navigate(['/checkout']);
  }

  goToDetails(id: number) {
    this.sidebarVisible = false;
    this.router.navigate(['/program-details', id]);
  }
}
