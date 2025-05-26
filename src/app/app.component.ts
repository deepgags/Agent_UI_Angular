import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterOutlet } from '@angular/router';
import { Pages } from './enums/pages';
import { environment } from './environments/environment.development';
import { SiteConfig } from './models/SiteConfig';
import { LoadingService } from './services/loading.service';
import { SiteConfigService } from './services/site-config.service';



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
	currentPath:string = ""
	constructor(
		public loadingService: LoadingService,
		private router: Router,
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		private location: Location,
		private siteConfigService: SiteConfigService,
	) {}

	ngOnInit() {
		this.currentPath = this.location.path()
		this.loadSiteConfiguration();
	}

	private loadSiteConfiguration(): void {
		const hostname = this.document.location.hostname;
		const apiUrl = `${environment.agentApiUrl}/customer/web`;
		this.loadingService.loadingOn();
		this.http.get(apiUrl, { params: { domain: hostname } })
			.subscribe({
				next: (response: any) => {
					const config: SiteConfig = response.data;
					this.loadingService.loadingOff();
					if (config && config.templateId) {
						this.siteConfigService.setConfig(config, hostname);
						if (this.currentPath === Pages.LOADING) {
							this.router.navigate([`/${config.templateId}`]);
						} else {
							this.router.navigate([this.currentPath]);
						}
					} else {
						this.router.navigate(['/default']);
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
