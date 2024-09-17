import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { DetailsComponent } from './pages/details/details.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DASHBOARD_ROUTES } from './pages/dashboard/dashboard.routes';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'auth/activate', component: ActivationComponent },
  { path: 'program-details/:id', component: DetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: DASHBOARD_ROUTES,
    canActivate: [authGuard]
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
