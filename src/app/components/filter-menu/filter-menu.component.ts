import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeModule, TreeNodeSelectEvent } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { NewsService } from 'src/app/services/News/news.service';
import { NewsArticleComponent } from '../news-article/news-article.component';
import { Article } from 'src/app/interfaces/misc/article';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { Attribute } from 'src/app/interfaces/misc/attribute';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { Category } from 'src/app/interfaces/misc/category';
import { AttributeValue } from 'src/app/interfaces/misc/attribute-value';

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
  selectedNode: TreeNode | null = null;
  newsItems: Article[] = [];

  @Input() mobile: boolean = false;

  @Output() filterChanged = new EventEmitter<{
    categoryId: number;
    attributeId: number | null;
    attributeValueId: number | null;
  }>();

  constructor(
    private newsService: NewsService,
    private errorInterceptor: ErrorInterceptorService,
    private fitnessProgramService: FitnessProgramService
  ) {}

  async ngOnInit() {
    await this.loadData();
    await this.loadRSSFeed();
  }

  async loadData() {
    try {
      const categories =
        await this.fitnessProgramService.getCategoriesWithAttributes();
      this.categories = categories.map((category: Category) => ({
        label: category.name,
        key: category.id,
        expanded: true,
        data: {
          categoryId: category.id,
          attributeId: null,
          attributeValueId: null
        },
        children: category.attributes.map((attribute: Attribute) => ({
          label: attribute.name,
          data: {
            categoryId: category.id,
            attributeId: attribute.id,
            attributeValueId: null
          },
          children: attribute.values.map((value: AttributeValue) => ({
            label: value.name,
            data: {
              categoryId: category.id,
              attributeId: attribute.id,
              attributeValueId: value.id
            }
          }))
        }))
      }));
    } catch (error) {
      this.errorInterceptor.handleError(error);
    }
  }

  async loadRSSFeed(): Promise<void> {
    try {
      this.newsItems = await this.newsService.getNews();
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    }
  }

  clearFilters() {
    this.filterChanged.emit({
      categoryId: -1,
      attributeId: null,
      attributeValueId: null
    });
    this.setExpansion(this.categories, false);
    this.selectedNode = null;
  }

  setExpansion(nodes: TreeNode[], expanded: boolean) {
    nodes.forEach((node) => {
      node.expanded = expanded;
      if (node.children) {
        this.setExpansion(node.children, expanded);
      }
    });
  }

  onNodeSelect(event: TreeNodeSelectEvent) {
    this.filterChanged.emit(event.node.data);
  }
}
