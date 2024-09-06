import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { Column } from 'src/app/interfaces/misc/column';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { ConvertMinutesPipe } from '../../../pipes/convert-minutes.pipe';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-programs',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConvertMinutesPipe,
    TooltipModule,
    DialogModule
  ],
  templateUrl: './view-programs.component.html',
  styleUrl: './view-programs.component.scss'
})
export class ViewProgramsComponent implements OnInit {
  programs!: FitnessProgram[];
  cols!: Column[];
  loading: boolean = true;
  totalRecords: number = 0;
  deleteDialogVisible: boolean = false;
  deleteId: number = 0;

  lastLazyLoadEvent!: TableLazyLoadEvent;

  private difficultyLevelMap: { [key: string]: string } = {
    BEGINNER: 'Početnik',
    INTERMEDIATE: 'Srednji',
    ADVANCED: 'Napredni'
  };
  private severityMap: { [key: string]: string } = {
    BEGINNER: 'success',
    INTERMEDIATE: 'warning',
    ADVANCED: 'danger'
  };

  constructor(
    private fitnessProgramService: FitnessProgramService,
    private errorInterceptorService: ErrorInterceptorService,
    private router: Router,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Ime', width: '20%', sortable: true },
      { field: 'description', header: 'Opis', width: '40%', sortable: false },
      { field: 'locationName', header: 'Lokacija', sortable: true },
      { field: 'duration', header: 'Trajanje', sortable: true },
      { field: 'difficultyLevel', header: 'Težina', sortable: false },
      { field: 'price', header: 'Cijena', sortable: true }
    ];
  }

  private transformDifficultyLevels() {
    this.programs = this.programs.map((program) => ({
      ...program,
      difficultyLevel:
        this.difficultyLevelMap[program.difficultyLevel] ||
        program.difficultyLevel,
      difficultySeverity: this.severityMap[program.difficultyLevel] || 'info'
    }));
  }

  private transformLocation() {
    this.programs = this.programs.map((program) => ({
      ...program,
      locationName: program.locationName || 'Online'
    }));
  }

  async loadPrograms(event: TableLazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loading = true;
    try {
      const params = {
        page: event.first! / event.rows!,
        size: event.rows!,
        sort: event.sortField
          ? `${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}`
          : undefined
      };

      const response = await this.fitnessProgramService.getMyFitnessPrograms(params);
      this.programs = response.content;
      this.totalRecords = response.totalElements;
      this.transformLocation();
      this.transformDifficultyLevels();
    } catch (error) {
      this.errorInterceptorService.handleError(error);
    } finally {
      this.loading = false;
    }
  }

  showDeleteDialog(id: number) {
    this.deleteDialogVisible = true;
    this.deleteId = id;
  }

  createProgram() {
    this.router.navigate(['/dashboard/create-program']);
  }

  editProgram(id: string) {
    this.router.navigate(['/dashboard/edit-program', id]);
  }

  async deleteProgram() {
    try {
      await this.fitnessProgramService.deleteFitnessProgram(this.deleteId);
      if (this.lastLazyLoadEvent) {
        await this.loadPrograms(this.lastLazyLoadEvent);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Uspješno',
        detail: 'Program je uspješno obrisan'
      });
    } catch (error) {
      this.errorInterceptorService.handleError(error as AxiosError);
    } finally {
      this.deleteDialogVisible = false;
      this.deleteId = 0;
    }
  }
}
