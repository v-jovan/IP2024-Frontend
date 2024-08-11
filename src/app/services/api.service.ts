import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { TokenStoreService } from '../store/TokenStore/token-store.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private axiosInstance: AxiosInstance;
  private noTokenUrls = environment.noTokenUrls;

  constructor(private tokenStore: TokenStoreService) {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: environment.apiTimeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = this.tokenStore.getToken();
        const tokenExcludedUrl = this.noTokenUrls.some((url) =>
          config.url?.startsWith(url)
        );

        if (!tokenExcludedUrl && token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          delete config.headers['Authorization'];
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  get axios() {
    return this.axiosInstance;
  }
}
