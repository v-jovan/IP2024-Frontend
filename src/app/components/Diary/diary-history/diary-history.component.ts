import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { ActivityResponse } from 'src/app/interfaces/responses/activity-response';

@Component({
  selector: 'app-diary-history',
  standalone: true,
  imports: [ScrollPanelModule, CommonModule, ButtonModule],
  templateUrl: './diary-history.component.html',
  styleUrl: './diary-history.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DiaryHistoryComponent {
  @Input({ required: true }) activities!: ActivityResponse[];
  @Output() selectedActivity: EventEmitter<ActivityResponse | null> =
    new EventEmitter<ActivityResponse | null>();

  selectedIndex: number | null = null;

  constructor() {}

  selectCard(index: number, activity: ActivityResponse): void {
    this.selectedIndex = index;
    this.selectedActivity.emit(activity);
  }

  getPdf() {
    console.log('Get PDF');
    console.log(this.activities);
  }
  newActivity() {
    this.selectedIndex = null;
    this.selectedActivity.emit(null);
  }
}
