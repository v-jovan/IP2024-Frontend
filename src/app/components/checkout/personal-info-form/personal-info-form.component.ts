import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryItemComponent } from '@components/util/country-item/country-item.component';
import { FormGroup } from '@angular/forms';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'personal-info-form',
  standalone: true,
  imports: [
    InputTextModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CountryItemComponent,
    KeyFilterModule
  ],
  templateUrl: './personal-info-form.component.html',
  styleUrl: './personal-info-form.component.scss'
})
export class PersonalInfoFormComponent {
  @Input() form!: FormGroup;
  @Input() countries!: any[];

  constructor(private formUtils: FormUtilsService) {}
  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.form, controlName);
  }
}
