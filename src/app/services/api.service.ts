import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { TokenStoreService } from '../store/TokenStore/token-store.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private axiosInstance: AxiosInstance;
  private excludedUrls = ['/auth', '/uploads'];

  constructor(private tokenStore: TokenStoreService) {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 1000
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Set up the request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = this.tokenStore.getToken(); // Get the token from the local storage
        const isExcludedUrl = this.excludedUrls.some((url) =>
          config.url?.startsWith(url)
        );

        // If the URL is not excluded and there is a token, add the Authorization header
        if (!isExcludedUrl && token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          // If the URL is excluded, delete the Authorization header
          delete config.headers['Authorization'];
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Set up the response interceptor
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
