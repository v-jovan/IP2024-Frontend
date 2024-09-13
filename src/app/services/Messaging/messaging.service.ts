import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Message } from '../../interfaces/misc/message';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messageURL = '/message';

  constructor(private apiService: ApiService) {}

  async sendMessage(message: Message) {
    const response = await this.apiService.axios.post(
      `${this.messageURL}/send`,
      message
    );
    return response.data;
  }

  async getConversations() {
    const response = await this.apiService.axios.get(
      `${this.messageURL}/conversations`
    );
    return response.data;
  }

  async getMessagesForConversation(conversationUserId: number) {
    const response = await this.apiService.axios.get(
      `${this.messageURL}/conversation/${conversationUserId}`
    );
    return response.data;
  }
}
