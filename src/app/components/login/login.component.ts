import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { Store } from '@ngrx/store';
import * as TokenActions from 'src/app/store/auth/auth.actions';

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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private formUtils: FormUtilsService,
    private authService: AuthService,
    private store: Store
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
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value
        };
        const response = await this.authService.login(loginData);
        console.log('Login successful, JWT:', response.token, response);
        this.store.dispatch(TokenActions.setToken({ token: response.token }));
      } catch (error) {
        console.error('Login failed', error);
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
