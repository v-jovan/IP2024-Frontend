import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';
import { Column } from 'src/app/interfaces/misc/column';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { TagModule } from 'primeng/tag';
import { ConvertMinutesPipe } from '../../../pipes/convert-minutes.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FitnessProgramService } from 'src/app/services/FitnessProgram/fitness-program.service';
import { YoutubePipe } from "../../../pipes/youtube.pipe";

@Component({
  selector: 'app-purchased-programs',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    TagModule,
    ConvertMinutesPipe,
    TooltipModule,
    ButtonModule,
    DialogModule,
    YoutubePipe,
    RouterModule
  ],
  templateUrl: './purchased-programs.component.html',
  styleUrl: './purchased-programs.component.scss'
})
export class PurchasedProgramsComponent implements OnInit {
  programs!: FitnessProgram[];
  cols!: Column[];
  loading: boolean = true;
  totalRecords: number = 0;

  videoDialogVisible: boolean = false;
  videoUrl: string | null = null;

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

  private statusMap: { [key: string]: string } = {
    ACTIVE: 'Aktivan',
    INACTIVE: 'Neaktivan'
  };

  constructor(
    private errorInterceptorService: ErrorInterceptorService,
    private fitnessProgramService: FitnessProgramService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Ime', width: '20%' },
      { field: 'locationName', header: 'Lokacija' },
      { field: 'duration', header: 'Trajanje' },
      { field: 'difficultyLevel', header: 'Težina' },
      { field: 'endDate', header: 'Krajnji datum' },
      { field: 'instructorName', header: 'Instruktor' },
      { field: 'price', header: 'Cijena' },
      { field: 'status', header: 'Status' }
    ];
  }

  async loadPrograms(event: TableLazyLoadEvent) {
    this.loading = true;
    try {
      const params = {
        page: event.first! / event.rows!,
        size: event.rows!
      };

      const response =
        await this.fitnessProgramService.getPurchasedPrograms(params);
      this.programs = response.content;
      this.totalRecords = response.totalElements;
      this.transformDifficultyLevels();
      this.transformLocation();
      this.transformStatus();
    } catch (error) {
      this.errorInterceptorService.handleError(error);
    } finally {
      this.loading = false;
    }
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

  private transformStatus() {
    this.programs = this.programs.map((program) => ({
      ...program,
      status: this.statusMap[program.status!] || program.status
    }));
  }

  showVideoDialog(youtubeUrl: string) {
    this.videoUrl = youtubeUrl.replace('watch?v=', 'embed/');
    this.videoDialogVisible = true;
  }
  clearVideoUrl() {
    this.videoUrl = null;
  }
}
