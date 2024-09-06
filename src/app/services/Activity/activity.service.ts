import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivityResponse } from 'src/app/interfaces/responses/activity-response';
import { ActivityRequest } from 'src/app/interfaces/requests/activity-request';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly activityURL = '/activities';

  constructor(private apiService: ApiService) {}

  async getAllActivities(): Promise<ActivityResponse[]> {
    const response = await this.apiService.axios.get(this.activityURL);
    return response.data as ActivityResponse[];
  }

  async addActivity(activity: ActivityRequest): Promise<ActivityResponse> {
    const resposne = await this.apiService.axios.post(
      this.activityURL,
      activity
    );
    return resposne.data as ActivityResponse;
  }
}
