import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { SignupRequest } from 'src/app/interfaces/signup-request';
import { LoginRequest } from 'src/app/interfaces/login-request';
import { JwtResponse } from 'src/app/interfaces/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = '/auth';

  constructor(private apiService: ApiService) {}

  async login(data: LoginRequest): Promise<JwtResponse> {
    const response = await this.apiService.axios.post<JwtResponse>(
      `${this.authURL}/login`,
      data
    );

    return response.data;
  }

  async signup(data: SignupRequest): Promise<JwtResponse> {
    const response = await this.apiService.axios.post<JwtResponse>(
      `${this.authURL}/signup`,
      data
    );

    return response.data;
  }
}
