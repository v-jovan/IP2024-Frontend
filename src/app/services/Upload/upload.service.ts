import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadURL = '/upload';

  constructor(private apiService: ApiService) {}

  async uploadImage(data: FormData) {
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
  }
}
