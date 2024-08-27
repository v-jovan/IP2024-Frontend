import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locationURL = '/location';

  constructor(private apiService: ApiService) {}

  async getLocations() {
    const response = await this.apiService.axios.get(this.locationURL);
    return response.data;
  }
}
