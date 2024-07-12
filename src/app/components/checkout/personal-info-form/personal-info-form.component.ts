import { Component, Input } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartSummaryComponent } from '@components/cart-summary/cart-summary.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CountryItemComponent } from '@components/util/country-item/country-item.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'personal-info-form',
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
    CountryItemComponent
  ],
  templateUrl: './personal-info-form.component.html',
  styleUrl: './personal-info-form.component.scss'
})
export class PersonalInfoFormComponent {
  @Input() form!: FormGroup;
  @Input() countries!: any[];
  constructor(private formBuilder: FormBuilder) {}

  getControl(controlName: string) {
    return this.form.get(controlName);
  }
}
