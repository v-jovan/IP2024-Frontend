import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { UploadResponse } from 'src/app/interfaces/upload-response';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadURL = '/upload';

  constructor(private apiService: ApiService) {}

  async uploadImage(data: FormData): Promise<UploadResponse> {
    try {
      const response = await this.apiService.axios.post(this.uploadURL, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image', error);
      throw error;
    }
  }
}
