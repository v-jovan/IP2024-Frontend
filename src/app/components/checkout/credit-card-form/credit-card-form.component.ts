import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';

@Component({
  selector: 'credit-card-form',
  standalone: true,
  imports: [
    CalendarModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputMaskModule,
    InputTextModule,
    CommonModule
  ],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.scss'
})
export class CreditCardFormComponent {
  @Input() form!: FormGroup;

  constructor(private formUtils: FormUtilsService) {}

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.form, controlName);
  }
}
