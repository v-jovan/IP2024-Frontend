import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

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

  getControl(controlName: string) {
    return this.form.get(controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    const field = this.getControl(controlName);
    return (field?.touched && field?.invalid) || false;
  }
}
