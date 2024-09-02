import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FitnessProgram } from 'src/app/interfaces/misc/fitness-program';
import { environment } from 'src/environments/environment.development';
import { TokenStoreService } from 'src/app/store/TokenStore/token-store.service';
import { LoginService } from 'src/app/services/LoginForm/login.service';

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
  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private loginService: LoginService
  ) {}

  addToCart() {
    if (this.tokenStoreService.isLoggedIn()) {
      alert('Adding to cart');
    } else {
      this.loginService.requestLogin();
    }
  }
  goToDetails(id: number) {
    this.router.navigate(['/program-details', id]);
  }
}
