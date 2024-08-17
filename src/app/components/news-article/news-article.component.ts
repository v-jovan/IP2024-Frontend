import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { Article } from 'src/app/interfaces/misc/article';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-news-article',
  standalone: true,
  imports: [CarouselModule, SkeletonModule, TooltipModule],
  templateUrl: './news-article.component.html',
  styleUrl: './news-article.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NewsArticleComponent implements OnChanges {
  @Input({ required: true }) articles: Article[] = [];
  loading: boolean = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['articles']) {
      this.loading = this.articles.length === 0;
    }
  }

  navigateToArticle(link: string) {
    window.open(link, '_blank');
  }
}
