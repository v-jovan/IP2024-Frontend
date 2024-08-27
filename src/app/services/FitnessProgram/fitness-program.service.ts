import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { FitnessProgramRequest } from '../../interfaces/requests/fitness-program-request';

@Injectable({
  providedIn: 'root'
})
export class FitnessProgramService {
  private programURL = '/programs';

  constructor(private apiService: ApiService) {}

  async createProgram(programData: FitnessProgramRequest, files: File[]) {
    const formData = new FormData();

    formData.append(
      'program',
      new Blob([JSON.stringify(programData)], { type: 'application/json' })
    );

    for (let file of files) {
      formData.append('files', file);
    }
    const response = await this.apiService.axios.post(
      this.programURL,
      formData
    );
    return response.data;
  }
}
