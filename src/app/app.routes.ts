import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './pages/details/details.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivationComponent } from './pages/activation/activation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'auth/activate', component: ActivationComponent },
  { path: 'program-details/:id', component: DetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'register', component: RegisterComponent }
];
