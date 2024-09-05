import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { environment } from 'src/environments/environment.development';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { LoginService } from 'src/app/services/LoginForm/login.service';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { CartItem } from 'src/app/interfaces/misc/cart-item';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/Order/order.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { UserProgramResponse } from 'src/app/interfaces/responses/user-program-response';
import { ProgramStatus } from 'src/app/enums/program-status';

@Component({
  selector: 'app-program-card',
  standalone: true,
  imports: [CardModule, ButtonModule, GalleriaModule, CurrencyPipe],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProgramCardComponent implements OnInit {
  @Input({ required: true }) program!: FitnessProgram;
  isInCart: boolean = false;
  isProgramPurchased: boolean = false;
  apiUrl: string = environment.apiUrl;
  private cartSubscription!: Subscription;

  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private cartStoreService: CartStoreService,
    private loginService: LoginService,
    private messageService: MessageService,
    private orderService: OrderService,
    private errorInterceptortService: ErrorInterceptorService
  ) {}

  async ngOnInit() {
    this.cartSubscription = this.cartStoreService
      .getCartItems()
      .subscribe((cartItems) => {
        this.isInCart = cartItems.some((item) => item.id === this.program.id);
      });

    await this.checkIfProgramPurchased();
  }

  async checkIfProgramPurchased() {
    if (this.tokenStoreService.isLoggedIn()) {
      try {
        const purchasedProgramsResponse =
          await this.orderService.getPurchasedPrograms();
        const purchasedPrograms = purchasedProgramsResponse.content;

        this.isProgramPurchased = purchasedPrograms.some(
          (program: UserProgramResponse) =>
            program.programName === this.program.name &&
            program.status === ProgramStatus.ACTIVE
        );
      } catch (error) {
        this.errorInterceptortService.handleError(error as AxiosError);
      }
    }
  }

  addToCart() {
    if (this.tokenStoreService.isLoggedIn()) {
      const cartItem: CartItem = {
        id: this.program.id,
        name: this.program.name,
        price: this.program.price,
        imgURL: `${this.apiUrl}${this.program?.images[0]}`
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
