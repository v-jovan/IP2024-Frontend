import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { CommentRequest } from 'src/app/interfaces/requests/comment-request';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly commentURL = '/comments';

  constructor(private apiService: ApiService) {}

  async getComments(data: CommentRequest) {
    const response = await this.apiService.axios.get(this.commentURL, {
      params: data
    });
    return response.data;
  }

  async createComment(comment: string, programId: string) {
    const response = await this.apiService.axios.post(
      this.commentURL,
      comment,
      {
        params: { programId },
        headers: {
          'Content-Type': 'text/plain'
        }
      }
    );
    return response.data;
  }
}
