import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHeaderComponent } from '@components/search-header/search-header.component';
import { FilterMenuComponent } from '../../components/filter-menu/filter-menu.component';
import { LoginComponent } from '../../components/login/login.component';
import { ProgramCardComponent } from '../../components/program-card/program-card.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { LoaderService } from 'src/app/services/Loader/loader.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    FormsModule,
    SearchHeaderComponent,
    FilterMenuComponent,
    LoginComponent,
    ProgramCardComponent,
    PaginatorModule
  ]
})
export class HomeComponent implements OnInit {
  programs: FitnessProgram[] = [];
  first: number = 0;
  rows: number = 9;
  totalRecords: number = 0;
  selectedCategoryId: number | null = null;
  selectedAttributeId: number | null = null;
  selectedAttributeValueId: number | null = null;

  constructor(
    private fitnessProgramService: FitnessProgramService,
    private errorInterceptorServic: ErrorInterceptorService,
    private loaderService: LoaderService
  ) {}

  async ngOnInit() {
    this.loaderService.show();
    await this.loadPrograms();
    this.loaderService.hide();
  }

  async loadPrograms() {
    const params = {
      page: this.first / this.rows,
      size: this.rows,
      categoryId: this.selectedCategoryId,
      attributeId: this.selectedAttributeId,
      attributeValueId: this.selectedAttributeValueId
    };

    try {
      const response = await this.fitnessProgramService.getAllPrograms(params);
      this.programs = response.content;
      this.totalRecords = response.totalElements;
    } catch (error) {
      this.errorInterceptorServic.handleError(error);
    } finally {
    }
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.loadPrograms();
  }

  onFilterChanged(filterData: {
    categoryId: number;
    attributeId: number | null;
    attributeValueId: number | null;
  }) {
    this.selectedCategoryId = filterData.categoryId;
    this.selectedAttributeId = filterData.attributeId;
    this.selectedAttributeValueId = filterData.attributeValueId;
    this.first = 0;
    this.loadPrograms();
  }
}
