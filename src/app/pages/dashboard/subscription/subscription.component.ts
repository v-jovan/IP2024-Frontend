import { Component, OnInit } from '@angular/core';
import { SubscriptionCardComponent } from '../../../components/subscription-card/subscription-card.component';
import { CategoryService } from 'src/app/services/Category/category.service';
import { Category } from 'src/app/interfaces/misc/category';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [SubscriptionCardComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private erroriInterceptorService: ErrorInterceptorService
  ) {}

  async ngOnInit() {
    try {
      this.categories =
        await this.categoryService.getCategoriesWithSubscriptions();
    } catch (error) {
      this.erroriInterceptorService.handleError(error as AxiosError);
    }
  }

  async selectCategory(category: Category) {
    if (!category.id) {
      return;
    }
    try {
      await this.categoryService.subscribe(category.id);
    } catch (error) {
      this.erroriInterceptorService.handleError(error as AxiosError);
    }
  }
}
