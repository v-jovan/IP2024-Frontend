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
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { PasswordModule } from 'primeng/password';
import { UserService } from 'src/app/services/User/user.service';

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
    ReactiveFormsModule,
    PasswordModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // Active tab index (Login/Register)
  activeIndex: number = 0;

  visible: boolean = false;

  // Form-related fields
  loginForm!: FormGroup;
  username: string = '';
  password!: string;

  @Input() iconOnly: boolean = false;
  @Input() smallButton: boolean = false;

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private formUtils: FormUtilsService,
    private authService: AuthService,
    private tokenStore: TokenStoreService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  // Initialize login form with validation rules
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Perform login operation
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
        const isActivated = (await this.userService.isUserActive()) as boolean;
        if (isActivated) {
          window.location.reload(); // Reload the page to apply the session
        }
      } catch (error) {
        this.loginForm.reset(); // Reset form on login failure
      }
    } else {
      this.loginForm.markAllAsTouched(); // Mark fields as touched to show validation errors
    }
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.loginForm, controlName);
  }

  showDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
    this.loginForm.reset();
  }

  goToRegister(): void {
    this.activeIndex = 1;
  }

  goToLogin(): void {
    this.activeIndex = 0;
  }

  goToRegisterPage(): void {
    this.router.navigate(['/register']);
  }
}
