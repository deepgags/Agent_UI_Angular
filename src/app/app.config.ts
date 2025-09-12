import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import Aura from "@primeng/themes/aura";
import { AngularSvgIconModule, provideAngularSvgIcon } from "angular-svg-icon";
// import { GalleryModule } from "ng-gallery";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import { DialogService } from "primeng/dynamicdialog";
import { routes } from "./app.routes";
import { AuthInterceptor } from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
		AngularSvgIconModule,
		provideAnimations(),
		provideAngularSvgIcon(),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		providePrimeNG({
			theme: {
				preset: Aura,
			},
		}),
		DialogService,
		ConfirmationService,
		MessageService,
	],
};
