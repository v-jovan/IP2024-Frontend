import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DividerModule,
    TabViewModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
/**
 * Represents the LoginComponent class.
 * This component is responsible for handling the login functionality.
 */
export class LoginComponent implements OnInit {
  activeIndex: number = 0;
  visible: boolean = false;
  username: string = '';
  password!: string;
  loginForm!: FormGroup;

  @Input() iconOnly: boolean = false;
  @Input() smallButton: boolean = false;
  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private formUtils: FormUtilsService,
    private authService: AuthService,
    private tokenStore: TokenStoreService,
    private errorInterceptor: ErrorInterceptorService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        const loginData = {
          emailOrUsername: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value
        };
        const response = await this.authService.login(loginData);
        this.tokenStore.setToken(response.token);
        this.loginSuccess.emit();
      } catch (error) {
        this.errorInterceptor.handleError(error);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.loginForm, controlName);
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  goToRegister() {
    this.activeIndex = 1;
  }

  goToLogin() {
    this.activeIndex = 0;
  }

  goToRegisterPage() {
    this.router.navigate(['/register']);
  }
}
