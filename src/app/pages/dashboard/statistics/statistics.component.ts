import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ActivityResponse } from 'src/app/interfaces/responses/activity-response';
import { ActivityService } from 'src/app/services/Activity/activity.service';
import { TabViewModule } from 'primeng/tabview';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { ACTIVITY_TYPES } from '@components/util/activity-types';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, TabViewModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  weightData: any;
  activityImpactData: any;
  activities: ActivityResponse[] = [];
  weightDataOptions: any;

  constructor(
    private activityService: ActivityService,
    private errorInterceptorService: ErrorInterceptorService
  ) {}

  async ngOnInit() {
    try {
      this.activities = await this.activityService.getAllActivities();
    } catch (error) {
      this.errorInterceptorService.handleError(error);
    }

    const logDates = this.activities.map((a) =>
      new Date(a.logDate).toLocaleDateString()
    );
    const weights = this.activities.map((a) => a.result);
    const intensities = this.activities.map((a) =>
      this.getIntensityValue(a.intensity)
    );
    const activityTypes = [
      ...new Set(this.activities.map((a) => a.activityType))
    ];

    this.weightData = {
      labels: logDates,
      datasets: [
        {
          label: 'Masa (kg)',
          data: weights,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        },
        {
          label: 'Nivo intenziteta',
          data: intensities,
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4,
          yAxisID: 'y2'
        }
      ]
    };

    this.weightDataOptions = {
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left'
        },
        y2: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            min: 0,
            max: 3,
            stepSize: 1
          }
        }
      }
    };

    this.activityImpactData = {
      labels: activityTypes.map((type) => this.getActivityLabel(type)),
      datasets: [
        {
          label: 'Ukupno trajanje (min)',
          data: activityTypes.map((type) =>
            this.activities
              .filter((a) => a.activityType === type)
              .reduce((total, a) => total + a.duration, 0)
          ),
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }

  getActivityLabel(value: string): string {
    const activity = ACTIVITY_TYPES.find(
      (activity) => activity.value === value
    );
    return activity ? activity.label : value;
  }

  getIntensityValue(intensity: string): number {
    switch (intensity.toLowerCase()) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      default:
        return 0;
    }
  }
}
