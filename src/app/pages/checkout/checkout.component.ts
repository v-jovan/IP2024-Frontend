import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartSummaryComponent } from '@components/cart-summary/cart-summary.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { CountryItemComponent } from '@components/util/country-item/country-item.component';
import { PersonalInfoFormComponent } from "../../components/checkout/personal-info-form/personal-info-form.component";

interface Country {
  name: string,
  code: string
}

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
    PersonalInfoFormComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  countries: Country[];
  addressForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.countries = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' }
    ];
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
  }

  goNext(nextCallback: EventEmitter<void>) {
    if (this.addressForm.valid) {
      nextCallback.emit();
    } else {
      this.addressForm.markAllAsTouched();
    }
  }
}
