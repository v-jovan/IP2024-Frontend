import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SearchHeaderComponent } from '@components/search-header/search-header.component';
import { FilterMenuComponent } from '../../components/filter-menu/filter-menu.component';
import { LoginComponent } from '../../components/login/login.component';
import { ProgramCardComponent } from '../../components/program-card/program-card.component';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CheckboxModule,
    FormsModule,
    SearchHeaderComponent,
    FilterMenuComponent,
    LoginComponent,
    ProgramCardComponent
  ]
})
export class HomeComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
