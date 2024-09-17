import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { LoginService } from 'src/app/services/LoginForm/login.service';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { CartItem } from 'src/app/interfaces/misc/cart-item';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UrlPipe } from '../../pipes/url.pipe';

@Component({
  selector: 'app-program-card',
  standalone: true,
  imports: [CardModule, ButtonModule, GalleriaModule, CurrencyPipe, UrlPipe],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProgramCardComponent implements OnInit {
  @Input({ required: true }) program!: FitnessProgram;
  @Input({ required: true }) showBuyButton: boolean = true;
  @Input({ required: true }) isProgramPurchased: boolean = false;
  isInCart: boolean = false;
  myId: number = 0;
  private cartSubscription!: Subscription;

  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private cartStoreService: CartStoreService,
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.cartSubscription = this.cartStoreService
      .getCartItems()
      .subscribe((cartItems) => {
        this.isInCart = cartItems.some((item) => item.id === this.program.id);
      });
  }

  addToCart() {
    if (this.tokenStoreService.isLoggedIn()) {
      const cartItem: CartItem = {
        id: this.program.id,
        name: this.program.name,
        price: this.program.price,
        imgURL: this.program?.images[0]
      };

      const success = this.cartStoreService.addToCart(cartItem);
      if (success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Dodano u korpu'
        });
        this.isInCart = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Proizvod već postoji u korpi'
        });
      }
    } else {
      this.loginService.requestLogin();
    }
  }
  goToDetails(id: number) {
    this.router.navigate(['/program-details', id]);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
