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

  async updateProgram(
    programId: string,
    programData: FitnessProgramRequest,
    files: File[],
    removedImages: string[]
  ) {
    const formData = new FormData();

    formData.append(
      'program',
      new Blob([JSON.stringify(programData)], { type: 'application/json' })
    );

    for (let file of files) {
      formData.append('files', file);
    }

    if (removedImages.length > 0) {
      const removedImagesBlob = new Blob([JSON.stringify(removedImages)], {
        type: 'application/json'
      });
      formData.append('removedImages', removedImagesBlob);
    }

    const response = await this.apiService.axios.put(
      `${this.programURL}/${programId}`,
      formData
    );
    return response.data;
  }

  async getMyFitnessPrograms(params: {
    page: number;
    size: number;
    sort?: string;
  }) {
    const response = await this.apiService.axios.get(
      `${this.programURL}/my-programs`,
      { params }
    );
    return response.data;
  }

  async getAllPrograms(params: { page: number; size: number; sort?: string }) {
    const response = await this.apiService.axios.get(this.programURL, {
      params
    });
    return response.data;
  }

  async getProgramById(id: string) {
    const response = await this.apiService.axios.get(
      `${this.programURL}/${id}`
    );
    return response.data;
  }

  async getCategoriesWithAttributes() {
    const response = await this.apiService.axios.get(
      `${this.programURL}/with-attributes`
    );
    return response.data;
  }

  async getPurchasedPrograms(params: {
    page: number;
    size: number;
  }) {
    const response = await this.apiService.axios.get(
      `${this.programURL}/purchased`,
      { params }
    );
    return response.data;
  }
}
