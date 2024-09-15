import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { UpdateUserRequest } from 'src/app/interfaces/requests/update-user-request';
import { UpdatePasswordRequest } from 'src/app/interfaces/requests/update-password-request';
import { environment } from 'src/environments/environment.development';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userURL = '/user';

  constructor(
    private apiService: ApiService,
    private tokenStoreService: TokenStoreService
  ) {}

  async getUserInfo() {
    const response = await this.apiService.axios.get(`${this.userURL}/info`);
    return response.data;
  }
  async getUserInfoById(id: number) {
    const response = await this.apiService.axios.get(`${this.userURL}/info-id`, {
      params: { id }
    });
    return response.data;
  }

  async updateUserInfo(data: UpdateUserRequest) {
    const response = await this.apiService.axios.patch(
      `${this.userURL}/info`,
      data
    );
    return response.data;
  }

  async changePassword(data: UpdatePasswordRequest) {
    const response = await this.apiService.axios.patch(
      `${this.userURL}/password`,
      data
    );
    return response.data;
  }

  async getAvatar() {
    const response = await this.apiService.axios.get(`${this.userURL}/avatar`);
    if (response.data) {
      return environment.apiUrl + response.data;
    }
    return response.data;
  }

  async isUserActive() {
    const response = await this.apiService.axios.get(`${this.userURL}/active`);
    return response.data;
  }

  async getUserId(): Promise<number> {
    const username = this.tokenStoreService.getUserSubject() as string;
    const response = await this.apiService.axios.get<number>(
      `${this.userURL}/user-id`,
      {
        params: { username }
      }
    );

    return response.data;
  }

  async getAdvisers() {
    const response = await this.apiService.axios.get(`${this.userURL}/advisers`);
    return response.data;
  }

  async getNonAdvisers() {
    const response = await this.apiService.axios.get(`${this.userURL}/non-advisers`);
    return response.data;
  }
}
