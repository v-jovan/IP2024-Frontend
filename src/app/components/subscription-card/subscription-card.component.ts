import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/interfaces/misc/category';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'subscription-card',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TooltipModule,
    CommonModule,
    ScrollPanelModule
  ],
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SubscriptionCardComponent {
  @Input({ required: true }) category!: Category;
  @Output() categorySelected = new EventEmitter<Category>();

  get label() {
    return this.category.subscribed ? 'Pretplaćen' : 'Preplati se';
  }
  get icon() {
    return this.category.subscribed ? 'pi pi-check' : 'pi pi-plus';
  }

  onSubscribe(category: Category) {
    this.categorySelected.emit(this.category);
    category.subscribed = !category.subscribed;
  }
}
