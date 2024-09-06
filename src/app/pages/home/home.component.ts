import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHeaderComponent } from '@components/search-header/search-header.component';
import { FilterMenuComponent } from '../../components/filter-menu/filter-menu.component';
import { ProgramCardComponent } from '../../components/program-card/program-card.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { UserService } from 'src/app/services/User/user.service';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { UserProgramResponse } from 'src/app/interfaces/responses/user-program-response';
import { ProgramStatus } from 'src/app/enums/program-status';
import { OrderService } from 'src/app/services/Order/order.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    FormsModule,
    SearchHeaderComponent,
    FilterMenuComponent,
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
  myId: number = 0;

  constructor(
    private fitnessProgramService: FitnessProgramService,
    private orderService: OrderService,
    private errorInterceptorService: ErrorInterceptorService,
    private loaderService: LoaderService,
    private userService: UserService,
    private tokenStoreService: TokenStoreService
  ) {}

  async ngOnInit() {
    this.loaderService.show();

    let purchasedPrograms: UserProgramResponse[] = [];

    if (this.isLoggedIn) {
      this.myId = await this.userService.getUserId();

      try {
        const purchasedProgramsResponse =
          await this.orderService.getPurchasedPrograms({
            page: 0,
            size: 100
          });

        purchasedPrograms = purchasedProgramsResponse.content;
      } catch (error) {
        this.errorInterceptorService.handleError(error);
      }
    }

    await this.loadPrograms();

    this.programs = this.programs.map((program) => {
      const isPurchased = purchasedPrograms.some(
        (purchased: UserProgramResponse) =>
          purchased.id === program.id &&
          purchased.status === ProgramStatus.ACTIVE
      );

      return {
        ...program,
        isPurchased: isPurchased
      };
    });

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
      this.errorInterceptorService.handleError(error);
    }
  }

  get isLoggedIn(): boolean {
    return this.tokenStoreService.isLoggedIn();
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
