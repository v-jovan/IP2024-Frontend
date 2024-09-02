import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-program-card',
  standalone: true,
  imports: [CardModule, ButtonModule, GalleriaModule, CurrencyPipe],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProgramCardComponent {
  @Input({ required: true }) program!: FitnessProgram;
  apiUrl: string = environment.apiUrl;
  constructor(private router: Router) {}

  addToCart() {
    alert('Adding to cart');
  }
  goToDetails(id: number) {
    this.router.navigate(['/program-details', id]);
  }
}
