import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    // importProvidersFrom(MessageService),
    MessageService,
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }
  ]
};
