import { Component, OnInit } from '@angular/core';
import { DiaryHistoryComponent } from '../../../components/Diary/diary-history/diary-history.component';
import { DiaryFormComponent } from '../../../components/Diary/diary-form/diary-form.component';
import { ActivityService } from 'src/app/services/Activity/activity.service';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { ActivityResponse } from 'src/app/interfaces/responses/activity-response';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [DiaryHistoryComponent, DiaryFormComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent implements OnInit {
  activities: ActivityResponse[] = [];
  selectedActivity: ActivityResponse | null = null;

  constructor(
    private activityService: ActivityService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    try {
      this.loaderService.show();
      await this.loadActivities();
    } finally {
      this.loaderService.hide();
    }
  }

  async loadActivities() {
    this.activities = await this.activityService.getAllActivities();
    this.activities.sort((a, b) => {
      return new Date(b.logDate).getTime() - new Date(a.logDate).getTime();
    });
  }

  selectActivity($event: ActivityResponse | null) {
    this.selectedActivity = $event;
  }

  async addActivity($event: ActivityResponse) {
    this.activities.unshift($event);
    try {
      await this.activityService.addActivity($event);
      this.messageService.add({
        severity: 'success',
        summary: 'Uspješno',
        detail: 'Aktivnost je uspješno dodana'
      });
    } catch (error) {}
  }

  async downloadPdf() {
    try {
      await this.activityService.downloadActivityPdf();
    } catch (error) {}
  }
}
