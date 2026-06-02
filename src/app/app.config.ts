import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, Router, Routes } from "@angular/router";
import Aura from "@primeng/themes/aura";
import { AngularSvgIconModule, provideAngularSvgIcon } from "angular-svg-icon";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import { DialogService } from "primeng/dynamicdialog";
import { routes } from "./app.routes";
import { AgentInterceptor } from "./interceptors/agent.interceptor";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { SiteIdInterceptor } from "./interceptors/site-id.interceptor";
import { RoutesConfigService } from "./services/routes-config.service";

const initializeApp = (router: Router, routesConfigService: RoutesConfigService): (() => Promise<void>) => {
	return async () => {
		const currentPath = document.location.pathname;

		if (
			currentPath === "/login" ||
			currentPath === "/register" ||
			currentPath === "/forgot-password" ||
			currentPath === "/verify"
		) {
			return;
		}

		try {
			const dynamicRoutes = await routesConfigService.loadSiteConfiguration();

			const newRoutes: Routes = [{ path: "", redirectTo: "/home", pathMatch: "full" }, dynamicRoutes, ...routes];

			router.resetConfig(newRoutes);
		} catch (error) {
			console.error(error);
		}
	};
};

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideHttpClient(withFetch(), withInterceptors([AuthInterceptor, AgentInterceptor, SiteIdInterceptor])),
		AngularSvgIconModule,
		provideAnimations(),
		provideAngularSvgIcon(),
		provideRouter(routes),
		providePrimeNG({
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: false,
				},
			},
		}),
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
