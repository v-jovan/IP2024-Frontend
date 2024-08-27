import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Attribute as CategoryAttribute } from 'src/app/interfaces/misc/attribute';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private attributeURL = '/attributes';

  constructor(private apiService: ApiService) {}

  async getAttributesByCategory(
    categoryId: number
  ): Promise<CategoryAttribute[]> {
    const response = await this.apiService.axios.get(
      `${this.attributeURL}/category/${categoryId}`
    );
    return response.data;
  }
}
