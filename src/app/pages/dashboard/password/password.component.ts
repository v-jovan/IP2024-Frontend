import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    DividerModule
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PasswordComponent implements OnInit {
  passwordForm: FormGroup = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    newRepeatPassword: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private formUtils: FormUtilsService
  ) {}
  ngOnInit(): void {}
}
