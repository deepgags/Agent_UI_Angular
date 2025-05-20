import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Added HttpClient & HttpClientModule
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { environment } from './environments/environment.development';
import { LoadingService } from './services/loading.service';
import { SiteConfigService } from './services/site-config.service'; // Import SiteConfigService

export interface SiteConfig {
	templateId: string;
	name: string;
	phone: string;
	email: string;
	address: string;
	primaryColor?: string;
	secondaryColor?: string;
	logoUrl?: string;
	domain?: string; // Added domain to the interface
	// Add other properties your API might return
	[key: string]: any; // Allow other dynamic properties
}

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		CommonModule,
		MatProgressSpinnerModule,
		HttpClientModule // Added HttpClientModule for standalone component
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

	constructor(
		public loadingService: LoadingService,
		private router: Router,
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		private siteConfigService: SiteConfigService,
		private route: ActivatedRoute
	) {
		console.log("called...")
		console.log(this.route)
		this.route.url.subscribe(urlSegments => {
			let currentUrl = urlSegments.join('/');
			console.log(currentUrl);
		});
	}

	ngOnInit() {
		this.loadSiteConfiguration();
	}

	private loadSiteConfiguration(): void {
		debugger
		const hostname = this.document.location.hostname;
		const apiUrl = `${environment.agentApiUrl}/customer/web`; // API endpoint

		// Check if config already exists in SiteConfigService (e.g., from localStorage)
		// const existingConfig = this.siteConfigService.getConfigForDomain(hostname);
		// if (existingConfig && existingConfig.templateId) {
		// 	this.router.navigate([`/${existingConfig.templateId}`]).catch(navError => console.error('Failed to navigate to cached template', navError));
		// 	return; // Config found, no need to fetch
		// }

		this.loadingService.loadingOn();

		this.http.get<SiteConfig>(apiUrl, { params: { domain: hostname } })
			.subscribe({
				next: (response: any) => {
					debugger
					const config: SiteConfig = response.data; // Cast to SiteConfig type
					this.loadingService.loadingOff();
					if (config && config.templateId) {
						this.siteConfigService.setConfig(config, hostname);
						// Store the fetched config
						// Navigate to the route corresponding to the templateId
						this.router.navigate([`/${config.templateId}`]).catch(navError => console.error(`Failed to navigate to template ${config.templateId}`, navError));
					} else {
						// console.warn('Template ID not found in response or config is null, navigating to default.');
						// this.router.navigate(['/default']).catch(navError => console.error('Failed to navigate to default template for missing ID', navError));
					}
				},
				error: (error: any) => { // Add type for error
					console.error('Failed to load site configuration:', error);
					this.loadingService.loadingOff();
					// Navigate to a default template or show an error page
					this.router.navigate(['/default']).catch((navError: any) => console.error('Failed to navigate to default template on error', navError));
					// No need to return of(null) here as it's a void subscribe callback
				}
			});
	}
}
