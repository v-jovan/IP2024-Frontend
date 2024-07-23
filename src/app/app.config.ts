import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  isDevMode
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { reducers } from './store/app.state';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore(reducers),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }), // DevTools only in dev mode
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }
  ]
};
