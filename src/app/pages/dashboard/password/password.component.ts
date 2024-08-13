import { Component, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { BottomToolbarComponent } from '@components/bottom-toolbar/bottom-toolbar.component';
import { passwordsMatchValidator } from 'src/app/validators/PasswordMatch';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/User/user.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    DividerModule,
    BottomToolbarComponent,
    FloatLabelModule
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PasswordComponent {
  passwordForm: FormGroup = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newRepeatPassword: ['', Validators.required]
    },
    { validators: passwordsMatchValidator() }
  );

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private errorInterceptor: ErrorInterceptorService
  ) {}

  async saveChanges() {
    try {
      if (this.passwordForm.valid) {
        const response = await this.userService.changePassword(
          this.passwordForm.value
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Uspjeh',
          detail: response
        });
        window.location.href = '/dashboard';
      } else {
        this.passwordForm.markAllAsTouched();
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Provjerite ispravnost unijetih podataka'
        });
      }
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    }
  }
  discardChanges() {
    window.location.href = '/dashboard';
  }
}
