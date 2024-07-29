import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { UploadResponse } from 'src/app/interfaces/responses/upload-response';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadURL = '/upload';

  constructor(
    private apiService: ApiService,
    private errorInterceptor: ErrorInterceptorService
  ) {}

  async uploadImage(data: FormData): Promise<String> {
    try {
      const response = await this.apiService.axios.post<String>(
        this.uploadURL,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private handleError(error: AxiosError): void {
    this.errorInterceptor.handleError(error);
  }
}
