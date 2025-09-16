import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from "@angular/core";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, Router, Routes } from '@angular/router';
import Aura from "@primeng/themes/aura";
import { AngularSvgIconModule, provideAngularSvgIcon } from "angular-svg-icon";
// import { GalleryModule } from "ng-gallery";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import { DialogService } from "primeng/dynamicdialog";
import { tap } from "rxjs";
import { routes } from "./app.routes";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { RoutesConfigService } from "./services/routes-config.service";

function initializeApp(router: Router, routesConfigService: RoutesConfigService): () => Promise<void> {
	return () =>
		new Promise<void>((resolve) => {
			routesConfigService
				.loadSiteConfiguration()
				.pipe(
					tap((dynamicRoutes: any) => {

						const newRoutes: Routes = [
							...routes,
							{ path: '', redirectTo: '/home', pathMatch: 'full' },
							...dynamicRoutes];
						router.resetConfig(newRoutes);
					})
				)
				.subscribe(() => resolve());
		});
}


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
		// provideAppInitializer(initializeApp(Router, RoutesConfigService))
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			multi: true,
			deps: [Router, RoutesConfigService],
		},
		DialogService,
		ConfirmationService,
		MessageService,
	],
};
