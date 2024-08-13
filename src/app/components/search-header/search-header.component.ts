import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from '@components/login/login.component';
import { CartComponent } from '@components/cart/cart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-search-header',
  standalone: true,
  templateUrl: './search-header.component.html',
  styleUrl: './search-header.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputTextModule,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    LoginComponent,
    CartComponent
  ]
})
export class SearchHeaderComponent implements OnInit {
  value!: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  ngOnInit(): void {
    this.value = '';
    this.route.queryParams.subscribe((params) => {
      if (params['activated'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Nalog aktiviran',
          detail: 'Uspješno ste aktivirali nalog. Sada se možete prijaviti.'
        });
        this.loginComponent.showDialog();
      }
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  openLoginDialog() {
    this.loginComponent.showDialog();
  }
}
