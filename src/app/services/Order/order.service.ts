import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { CartStoreService } from 'src/app/store/CartStore/cart-store.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly orderURL = '/user-programs';

  constructor(
    private apiService: ApiService,
    private cartStoreService: CartStoreService
  ) {}

  async createOrder(programId: number) {
    const response = await this.apiService.axios.post(
      `${this.orderURL}/${programId}`
    );
    return response.data;
  }

  async getUserPrograms() {
    const response = await this.apiService.axios.get(this.orderURL);
    return response.data;
  }

  async getPurchasedPrograms(params: { page: number; size: number }) {
    const response = await this.apiService.axios.get(this.orderURL, { params });
    return response.data;
  }

  async deletePurchasedFitnessProgram(id: number) {
    await this.apiService.axios.delete(`${this.orderURL}/${id}`);
  }
}
