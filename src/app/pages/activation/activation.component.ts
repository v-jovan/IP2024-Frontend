import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { LoaderService } from 'src/app/services/Loader/loader.service';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [],
  template: ''
})
export class ActivationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaderService.show();
    const params = this.route.snapshot.queryParams;
    const token = params['token'];

    if (token) {
      try {
        await this.authService.activateAccount(token);
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Došlo je do greške prilikom aktivacije naloga.'
        });
      } finally {
        this.loaderService.hide();
        this.router.navigate(['/home'], { queryParams: { activated: 'true' } });
      }
    }
  }
}
