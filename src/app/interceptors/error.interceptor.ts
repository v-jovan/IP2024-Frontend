import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
// this is not a classically defined interceptor, but it is a service that
// handles errors as an interceptor would do (for HTTP requests using HTTPInterceptor)
export class ErrorInterceptorService {
  constructor(private messageService: MessageService) {}

  handleError(error: AxiosError): void {
    if (error.response) {
      this.handleErrorResponse(error.response);
    } else if (error.request) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mrežna greška',
        detail: 'Provjerite svoju internet konekciju i pokušajte ponovo.'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Greška',
        detail: 'Došlo je do nepoznate greške. Molimo pokušajte kasnije.'
      });
    }
  }

  private handleErrorResponse(errorResponse: any) {
    switch (errorResponse.status) {
      case 400:
        this.messageService.add({
          severity: 'error',
          summary: 'Neispravan zahtjev',
          detail:
            errorResponse.data?.message ||
            'Provjerite svoje podatke i pokušajte ponovo.'
        });
        break;
      case 401:
        this.messageService.add({
          severity: 'error',
          summary: 'Neovlašćeno',
          detail:
            errorResponse.data?.message ||
            'Neispravni kredencijali. Pokušajte ponovo.'
        });
        break;
      case 403:
        this.messageService.add({
          severity: 'error',
          summary: 'Zabranjeno',
          detail: errorResponse.data?.message || 'Nemate dozvolu za ovu akciju.'
        });
        break;
      case 404:
        this.messageService.add({
          severity: 'error',
          summary: 'Nije pronađeno',
          detail: errorResponse.data?.message || 'Traženi resurs nije pronađen.'
        });
        break;
      case 409:
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail:
            errorResponse.data?.message ||
            'Korisnik sa ovim emailom već postoji.'
        });
        break;
      case 503:
        this.messageService.add({
          severity: 'error',
          summary: 'Greška u slanju emaila',
          detail:
            errorResponse.data?.message ||
            'Došlo je do greške prilikom slanja emaila. Molimo pokušajte kasnije.'
        });
        break;
      case 500:
        this.messageService.add({
          severity: 'error',
          summary: 'Greška servera',
          detail: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.'
        });
        break;
      default:
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Došlo je do nepoznate greške. Molimo pokušajte kasnije.'
        });
        break;
    }
  }
}
