import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { UpdateUserRequest } from 'src/app/interfaces/requests/update-user-request';
import { UpdatePasswordRequest } from 'src/app/interfaces/requests/update-password-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userURL = '/user';

  constructor(private apiService: ApiService) {}

  async getUserInfo() {
    const response = await this.apiService.axios.get(`${this.userURL}/info`);
    return response.data;
  }

  async updateUserInfo(data: UpdateUserRequest) {
    const response = await this.apiService.axios.patch(`${this.userURL}/info`, data);
    return response.data;
  }

  async changePassword(data: UpdatePasswordRequest) { 
    const response = await this.apiService.axios.patch(`${this.userURL}/password`, data);
    return response.data;
  }
}
