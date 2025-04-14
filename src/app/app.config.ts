import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AngularSvgIconModule, provideAngularSvgIcon } from 'angular-svg-icon';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),provideHttpClient(withFetch()),
    AngularSvgIconModule,
    provideAnimations(), 
    provideAngularSvgIcon(),
     provideRouter(routes),
      provideClientHydration(withEventReplay())]
};
