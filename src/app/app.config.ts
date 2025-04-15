import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AngularSvgIconModule, provideAngularSvgIcon } from 'angular-svg-icon';
import { GalleryModule } from 'ng-gallery';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),provideHttpClient(withFetch()),
    AngularSvgIconModule,
    provideAnimations(),
    provideAngularSvgIcon(),
     provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(GalleryModule)
  ]
};
