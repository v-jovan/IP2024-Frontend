import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { CityRequest } from 'src/app/interfaces/requests/city-request';
import { City } from 'src/app/interfaces/misc/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private cityURL = '/cities';

  constructor(private apiService: ApiService) {}

  async getCities(): Promise<City[]> {
    const response = await this.apiService.axios.get(this.cityURL);
    return response.data;
  }

  async createCity(data: CityRequest): Promise<City> {
    const response = await this.apiService.axios.post(this.cityURL, data);
    return response.data;
  }
}
