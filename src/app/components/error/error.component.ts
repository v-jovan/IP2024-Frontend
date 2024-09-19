import { Component, ViewEncapsulation } from '@angular/core';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [PanelModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent {}
