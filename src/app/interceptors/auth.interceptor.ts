import { AxiosInstance } from 'axios';
import { Injector } from '@angular/core';
import { TokenStoreService } from '../store/TokenStore/token-store.service';

export function AuthInterceptor(
  axiosInstance: AxiosInstance,
  injector: Injector
) {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const tokenStore = injector.get(TokenStoreService);
      const token = tokenStore.getToken();

      if (token) {
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
}
