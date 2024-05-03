import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FilterMenuComponent } from '../../components/filter-menu/filter-menu.component';
import { DividerModule } from 'primeng/divider';
import { LoginComponent } from "../../components/login/login.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [
        CheckboxModule,
        FormsModule,
        HeaderComponent,
        FilterMenuComponent,
        DividerModule,
        LoginComponent
    ]
})
export class HomeComponent {
  checked: boolean = false;
}
