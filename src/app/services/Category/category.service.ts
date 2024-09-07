import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryURL = '/category';

  constructor(private apiService: ApiService) {}

  async getCategories() {
    const response = await this.apiService.axios.get(this.categoryURL);
    return response.data;
  }

  async getCategoriesWithSubscriptions() {
    const response = await this.apiService.axios.get(
      `${this.categoryURL}/subscriptions`
    );
    return response.data;
  }

  async subscribe(categoryId: number) {
    const response = await this.apiService.axios.post(
      `${this.categoryURL}/subscribe`,
      { categoryId }
    );
    return response.data;
  }
}
