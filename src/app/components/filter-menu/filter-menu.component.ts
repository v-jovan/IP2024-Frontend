import { Component, ViewEncapsulation } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { NewsService } from 'src/app/services/News/news.service';
import { NewsArticleComponent } from '../news-article/news-article.component';
import { Article } from 'src/app/interfaces/misc/article';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';

@Component({
  selector: 'app-filter-menu',
  standalone: true,
  imports: [ButtonModule, TreeModule, DividerModule, NewsArticleComponent],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FilterMenuComponent {
  categories!: TreeNode[];
  treeExpanded = false;
  newsItems: Article[] = [];

  constructor(
    private newsService: NewsService,
    private errorInterceptor: ErrorInterceptorService
  ) {}

  ngOnInit() {
    this.categories = [
      {
        label: 'U sali',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'Na terenu',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'U sali',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'Na terenu',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'U sali',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'Na terenu',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'U sali',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      },
      {
        label: 'Na terenu',
        children: [{ label: 'Sa loptom' }, { label: 'Sa spravama' }]
      }
    ];
    this.loadRSSFeed();
  }

  async loadRSSFeed(): Promise<void> {
    try {
      this.newsItems = await this.newsService.getNews();
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    }
  }

  toggleTree() {
    this.treeExpanded = !this.treeExpanded;
    this.setExpansion(this.categories, this.treeExpanded);
  }

  setExpansion(nodes: TreeNode[], expanded: boolean) {
    nodes.forEach((node) => {
      node.expanded = expanded;
      if (node.children) {
        this.setExpansion(node.children, expanded);
      }
    });
  }
}
