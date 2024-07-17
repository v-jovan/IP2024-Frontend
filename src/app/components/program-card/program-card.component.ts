import { Component, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { FitnessProgram } from '../../../models/interfaces';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-program-card',
  standalone: true,
  imports: [CardModule, ButtonModule, GalleriaModule, CurrencyPipe],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProgramCardComponent {
  program: FitnessProgram = {
    id: 1,
    name: 'Program 1',
    price: 100,
    images: [
      'https://placehold.co/200x150',
      'https://upload.wikimedia.org/wikipedia/commons/6/6d/TFT-Pixel-Demo-Image-200x150.png',
      'https://placehold.co/500x500'
    ]
  };
  constructor(private router: Router) {}

  addToCart() {
    alert('Adding to cart');
  }
  goToDetails(id: number) {
    this.router.navigate(['/program-details', id]);
  }
}
