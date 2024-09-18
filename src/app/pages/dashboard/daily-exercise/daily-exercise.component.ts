import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExerciseCardComponent } from '../../../components/exercise-card/exercise-card.component';
import { DailyExerciseService } from 'src/app/services/DailyExercise/daily-exercise.service';
import { Exercise } from 'src/app/interfaces/misc/exercise';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-daily-exercise',
  standalone: true,
  imports: [ExerciseCardComponent, DialogModule, ButtonModule],
  templateUrl: './daily-exercise.component.html',
  styleUrl: './daily-exercise.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DailyExerciseComponent implements OnInit {
  exercises: Exercise[] = [];
  exerciseDialog: boolean = false;
  exerciseDialogData: Exercise | null = null;

  constructor(
    private dailyExercisesService: DailyExerciseService,
    private loaderService: LoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loaderService.show();
      this.exercises = await this.dailyExercisesService.getDailyExercises();
    } finally {
      this.loaderService.hide();
    }
  }

  showExerciseDialog(exercise: Exercise) {
    this.exerciseDialog = true;
    this.exerciseDialogData = exercise;
  }

  formatString(input: string | null | undefined): string {
    if (!input) return '';
    let formattedString = input.replace(/_/g, ' ');
    formattedString = formattedString.replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

    return formattedString;
  }
}
