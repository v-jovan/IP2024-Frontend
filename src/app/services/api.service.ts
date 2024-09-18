import { Injectable, Injector } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment.development';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { ErrorInterceptor } from '../interceptors/error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(private injector: Injector) {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: environment.apiTimeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    AuthInterceptor(this.axiosInstance, this.injector);
    ErrorInterceptor(this.axiosInstance, this.injector);
  }

  get axios() {
    return this.axiosInstance;
  }
}
