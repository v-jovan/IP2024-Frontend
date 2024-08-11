import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadURL = '/upload';

  constructor(
    private apiService: ApiService,
    private errorInterceptor: ErrorInterceptorService
  ) {}

  async uploadImage(data: FormData): Promise<string> {
    try {
      const response = await this.apiService.axios.post<string>(
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
