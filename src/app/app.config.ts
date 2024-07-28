import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  isDevMode
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }
  ]
};
 