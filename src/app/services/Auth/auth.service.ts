import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { SignupRequest } from 'src/app/interfaces/requests/signup-request';
import { LoginRequest } from 'src/app/interfaces/requests/login-request';
import { JwtResponse } from 'src/app/interfaces/responses/jwt-response';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Service responsible for handling authentication-related operations.
 */
export class AuthService {
  private authURL = '/auth';

  constructor(
    private apiService: ApiService,
    private tokenService: TokenStoreService,
    private cartStoreService: CartStoreService,
    private router: Router
  ) {}

  /**
   * Logs in the user with the provided login credentials.
   * @param data - The login request data.
   * @returns A promise that resolves to a JwtResponse object.
   */
  async login(data: LoginRequest): Promise<JwtResponse> {
    const response = await this.apiService.axios.post<JwtResponse>(
      `${this.authURL}/login`,
      data
    );

    return response.data;
  }

  logout() {
    this.tokenService.clearToken();
    this.cartStoreService.clearCart();
    this.router.navigate(['/']);
  }

  /**
   * Signs up the user with the provided signup data.
   * @param data - The signup request data.
   * @returns A promise that resolves to a JwtResponse object.
   */
  async signup(data: SignupRequest): Promise<JwtResponse> {
    const response = await this.apiService.axios.post(
      `${this.authURL}/signup`,
      data
    );

    return response.data;
  }

  /**
   * Activates the user account with the provided activation token.
   * @param token - The activation token.
   * @returns A promise that resolves to a string indicating the result of the activation.
   */
  async activateAccount(token: string): Promise<string> {
    const response = await this.apiService.axios.get(
      `${this.authURL}/activate`,
      {
        params: { token }
      }
    );

    return response.data;
  }

  /**
   * Checks if a username is available.
   * @param username - The username to check.
   * @returns A Promise that resolves to a boolean indicating if the username is available.
   */
  async checkUsername(username: string): Promise<boolean> {
    const response = await this.apiService.axios.post<boolean>(
      `${this.authURL}/check-username`,
      { username }
    );

    return response.data;
  }

  async resendActivationEmail() {
    const token: string = this.tokenService.getToken() as string;
    const email: string = this.tokenService.getUserEmail() as string;

    const response = await this.apiService.axios.post(
      `${this.authURL}/resend-email`,
      { email, token }
    );

    return response.data;
  }
}
