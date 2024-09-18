import { AxiosInstance, AxiosError } from 'axios';
import { ErrorHandlerService } from '../services/ErrorHandler/error-handler.service';
import { Injector } from '@angular/core';

export function ErrorInterceptor(
  axiosInstance: AxiosInstance,
  injector: Injector
) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const errorHandler = injector.get(ErrorHandlerService);
      errorHandler.handleError(error);
      return Promise.reject(error);
    }
  );
}
