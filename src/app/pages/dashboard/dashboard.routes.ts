import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'view-programs',
    pathMatch: 'full'
  },
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
  },
  {
    path: 'create-program',
    loadComponent: () =>
      import('./create-program/create-program.component').then(
        (m) => m.CreateProgramComponent
      )
  },
  {
    path: 'view-programs',
    loadComponent: () =>
      import('./view-programs/view-programs.component').then(
        (m) => m.ViewProgramsComponent
      )
  },
  {
    path: 'purchased-programs',
    loadComponent: () =>
      import('./purchased-programs/purchased-programs.component').then(
        (m) => m.PurchasedProgramsComponent
      )
  },
  {
    path: 'edit-program/:id',
    loadComponent: () =>
      import('./edit-program/edit-program.component').then(
        (m) => m.EditProgramComponent
      )
  },
  {
    path: 'diary',
    loadComponent: () =>
      import('./diary/diary.component').then((m) => m.DiaryComponent)
  }
];
