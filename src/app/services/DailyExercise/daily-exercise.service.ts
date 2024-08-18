import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Exercise } from 'src/app/interfaces/misc/exercise';

@Injectable({
  providedIn: 'root'
})
export class DailyExerciseService {

  private dailyExerciseURL = '/daily-exercises';

  constructor(private apiService: ApiService) { }

  async getDailyExercises(): Promise<Exercise[]> {
    const response = await this.apiService.axios.get(this.dailyExerciseURL);
    return response.data;
  }
}
