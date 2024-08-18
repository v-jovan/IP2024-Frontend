import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: 'password',
    loadComponent: () =>
      import('./password/password.component').then((m) => m.PasswordComponent)
  },
  {
    path: 'daily-exercise',
    loadComponent: () =>
      import('./daily-exercise/daily-exercise.component').then(
        (m) => m.DailyExerciseComponent
      )
  }
];
