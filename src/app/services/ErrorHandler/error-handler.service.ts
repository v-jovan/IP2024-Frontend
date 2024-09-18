import { Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private injector: Injector,
    private router: Router
  ) {}

  handleError(error: AxiosError): void {
    const messageService = this.injector.get(MessageService); // Lazy load MessageService
    if (error.response) {
      this.handleErrorResponse(error.response, messageService);
    } else if (error.request) {
      messageService.add({
        severity: 'error',
        summary: 'Mrežna greška',
        detail: 'Provjerite svoju internet konekciju i pokušajte ponovo.'
      });
    } else {
      messageService.add({
        severity: 'error',
        summary: 'Greška',
        detail: 'Došlo je do nepoznate greške. Molimo pokušajte kasnije.'
      });
    }
  }

  private handleErrorResponse(
    errorResponse: any,
    messageService: MessageService
  ) {
    const errorCode = errorResponse.data?.error;
    const authService = this.injector.get(AuthService); // Lazy load AuthService

    switch (errorResponse.status) {
      case 400:
        messageService.add({
          severity: 'error',
          summary: 'Neispravan zahtjev',
          detail:
            errorResponse.data?.message ||
            'Provjerite svoje podatke i pokušajte ponovo.'
        });
        break;
      case 401:
        if (errorCode && errorCode === 'JWT_EXPIRED') {
          messageService.add({
            severity: 'error',
            summary: 'Istekla sesija',
            detail: 'Vaša sesija je istekla. Molimo prijavite se ponovo.'
          });
          authService.logout();
        } else {
          messageService.add({
            severity: 'error',
            summary: 'Zabranjen pristup',
            detail:
              errorResponse.data?.message ||
              'Neispravni kredencijali. Pokušajte ponovo.'
          });
        }
        break;
      case 403:
        messageService.add({
          severity: 'error',
          summary: 'Zabranjeno',
          detail: errorResponse.data?.message || 'Nemate dozvolu za ovu akciju.'
        });
        break;
      case 404:
        messageService.add({
          severity: 'error',
          summary: 'Nije pronađeno',
          detail: errorResponse.data?.message || 'Traženi resurs nije pronađen.'
        });
        this.router.navigate(['/not-found']);
        break;
      case 409:
        messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail:
            errorResponse.data?.message ||
            'Korisnik sa ovim emailom već postoji.'
        });
        break;
      case 503:
        messageService.add({
          severity: 'error',
          summary: 'Greška u slanju emaila',
          detail:
            errorResponse.data?.message ||
            'Došlo je do greške prilikom slanja emaila. Molimo pokušajte kasnije.'
        });
        break;
      case 500:
        messageService.add({
          severity: 'error',
          summary: 'Greška servera',
          detail: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.'
        });
        break;
      default:
        messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Došlo je do nepoznate greške. Molimo pokušajte kasnije.'
        });
        break;
    }
  }
}
