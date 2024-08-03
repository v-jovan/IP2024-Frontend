import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    MessageService,
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }
  ]
};
