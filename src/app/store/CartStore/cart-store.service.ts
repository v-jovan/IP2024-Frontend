import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from 'src/app/interfaces/misc/cart-item';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {
  private readonly cartKey = 'cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(
    this.getCartItemsFromStorage()
  );
  private expirationTime: number = environment.cartItemTimeoutMin * 60 * 1000;

  constructor() {
    this.checkExpiredItems();
  }

  // Add an item to the cart, returns true if the item was added, false if it already exists.
  addToCart(item: CartItem): boolean {
    const currentItems = this.cartItemsSubject.value;
    const exists = currentItems.find((cartItem) => cartItem.id === item.id);
    if (!exists) {
      item.addedAt = Date.now();
      currentItems.push(item);
      this.updateCartInStorage(currentItems);
      return true;
    }
    return false;
  }

  //Remove an item from the cart.
  removeFromCart(itemId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(
      (item) => item.id !== itemId
    );
    this.updateCartInStorage(currentItems);
  }

  //Clear all items from the cart.
  clearCart(): void {
    this.updateCartInStorage([]);
  }

  /**
   * Get the Observable that tracks the state of the cart.
   * Components can subscribe to this to track changes in the cart
   */
  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  // Checks if an item is in the cart
  isInCart(itemId: number): boolean {
    return this.cartItemsSubject.value.some((item) => item.id === itemId);
  }

  // Method for getting items from localStorage
  private getCartItemsFromStorage(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Method for updating items in localStorage and emitting new values.
  private updateCartInStorage(cartItems: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
    this.cartItemsSubject.next(cartItems); // Emit new values
  }

  // Check all items in the cart and remove the ones that have expired.
  private checkExpiredItems(): void {
    const currentItems = this.cartItemsSubject.value;
    const currentTime = Date.now();

    currentItems.forEach((item) => {
      const timeInCart = currentTime - (item.addedAt || 0);

      if (timeInCart >= this.expirationTime) {
        this.removeFromCart(item.id);
      } else {
        const remainingTime = this.expirationTime - timeInCart;
        setTimeout(() => {
          this.removeFromCart(item.id);
        }, remainingTime);
      }
    });
  }
}
