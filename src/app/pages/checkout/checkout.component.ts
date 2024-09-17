import { Component, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartSummaryComponent } from '@components/checkout/cart-summary/cart-summary.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { CountryItemComponent } from '@components/util/country-item/country-item.component';
import { PersonalInfoFormComponent } from '../../components/checkout/personal-info-form/personal-info-form.component';
import { CreditCardFormComponent } from '../../components/checkout/credit-card-form/credit-card-form.component';
import { FinishComponent } from '../../components/checkout/finish/finish.component';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/interfaces/misc/cart-item';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { OrderService } from 'src/app/services/Order/order.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { MessageService } from 'primeng/api';
import { Country } from 'src/app/interfaces/misc/country';
import { Countries } from 'src/app/enums/countries';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    CartSummaryComponent,
    ReactiveFormsModule,
    CountryItemComponent,
    PersonalInfoFormComponent,
    CreditCardFormComponent,
    FinishComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  activeStep: number | undefined = 0;
  countries!: Country[];
  addressForm!: FormGroup;
  creditCardForm!: FormGroup;
  cartItems: CartItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cartStoreService: CartStoreService,
    private loaderService: LoaderService,
    private orderService: OrderService,
    private errorInterceptorService: ErrorInterceptorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cartStoreService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });

    this.countries = Object.values(Countries).map((countryStr: string) => {
      const countryObj = JSON.parse(countryStr);
      return {
        name: countryObj.name,
        code: countryObj.code
      } as Country;
    });
    this.addressForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      phone: [''],
      country: [null, Validators.required]
    });
    this.creditCardForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required]],
      cardHolder: ['', [Validators.required]],
      expiryDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  goNext(nextCallback: EventEmitter<void>, form: FormGroup) {
    if (form.valid) {
      nextCallback.emit();
    } else {
      form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Greška',
        detail: 'Molimo popunite sva obavezna polja'
      });
    }
  }

  goBack(backCallback: EventEmitter<void>) {
    backCallback.emit();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  async finalizeOrder(nextCallback: EventEmitter<void>, form: FormGroup) {
    if (!form.valid) {
      form.markAllAsTouched();
      return;
    }
    try {
      this.loaderService.show();
      for (const program of this.cartItems) {
        await this.orderService.createOrder(program.id);
      }
      nextCallback.emit();
    } catch (error) {
      this.errorInterceptorService.handleError(error as AxiosError);
    } finally {
      this.loaderService.hide();
    }
  }
}
