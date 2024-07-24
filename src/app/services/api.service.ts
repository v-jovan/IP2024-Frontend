import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import axios, { AxiosInstance } from 'axios';
import { selectToken } from '../store/auth/auth.selector';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private axiosInstance: AxiosInstance;
  private excludedUrls = ['/auth', '/uploads'];

  constructor(private store: Store) {
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
        const token = await this.getToken();
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

  // Method to get token from the store
  private getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      this.store.select(selectToken).subscribe((token) => {
        resolve(token);
      });
    });
  }

  get axios() {
    return this.axiosInstance;
  }
}
