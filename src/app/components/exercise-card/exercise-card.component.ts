import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Exercise } from 'src/app/interfaces/misc/exercise';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [CardModule, ButtonModule, TooltipModule],
  templateUrl: './exercise-card.component.html',
  styleUrl: './exercise-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ExerciseCardComponent {
  private imageUrl: string = 'assets/exercise-imgs/';
  private imgExtension: string = '.png';

  @Input({ required: true }) exercise!: Exercise;
  @Output() viewDetails = new EventEmitter<Exercise>();

  getImage() {
    return this.imageUrl + this.exercise.type + this.imgExtension;
  }

  showDetails(exercise: Exercise) {
    this.viewDetails.emit(exercise);
  }
}
