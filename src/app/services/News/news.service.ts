import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Article } from 'src/app/interfaces/misc/article';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsURL = '/news';

  constructor(private apiService: ApiService) {}

  async getNews(): Promise<Article[]> {
    const response = await this.apiService.axios.get(this.newsURL);
    return response.data;
  }
}
