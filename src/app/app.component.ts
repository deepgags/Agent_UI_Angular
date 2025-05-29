import { CommonModule, DOCUMENT, Location } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { Pages } from "./enums/pages";
import { environment } from "./environments/environment.development";
import { LoadingService } from "./services/loading.service";
import { SiteConfigService } from "./services/site-config.service";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		CommonModule,
		MatProgressSpinnerModule,
		HttpClientModule, // Added HttpClientModule for standalone component
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	currentPath: string = "";
	queryParams: any = {};
	constructor(
		public loadingService: LoadingService,
		private router: Router,
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		private location: Location,
		private siteConfigService: SiteConfigService
	) {}

	ngOnInit() {
		const queryStr = window.location.search;
		if (queryStr) {
			const urlParams = new URLSearchParams(queryStr);
			for (const [key, value] of urlParams) {
				this.queryParams[key] = value;
			}
		}
		this.currentPath = this.location.path().split("?")[0];
		this.loadSiteConfiguration();
	}

	private loadSiteConfiguration(): void {
		const hostname = this.document.location.hostname;
		const apiUrl = `${environment.agentApiUrl}/customer/web`;
		this.loadingService.loadingOn();
		this.http.get(apiUrl, { params: { domain: hostname } }).subscribe({
			next: (response: any) => {
				const config: any = response.data;
				this.loadingService.loadingOff();
				this.redirectToTemplate(config);
			},
			error: (error: any) => {
				console.error("Failed to load site configuration:", error);
				this.loadingService.loadingOff();
				this.router.navigate(["/default"]);
			},
		});
	}

	redirectToTemplate(config: any) {
		// if (this.currentPath != Pages.REGISTER
		// 	&& this.currentPath != Pages.LOGIN
		// 	&& this.currentPath != Pages.VERIFY_EMAIL
		// 	&& this.currentPath.indexOf(Pages.VERIFY_EMAIL) > 0
		// 	&& this.currentPath != Pages.PROFILE
		// 	|| (this.currentPath == '/' || this.currentPath === Pages.LOADING)
		// ) {
		// }
		// else
		if (config && config.websiteSettings && config.websiteSettings.templateId) {
			const hostname = this.document.location.hostname;
			this.siteConfigService.setConfig(config, hostname);
			if (this.currentPath === Pages.LOADING) {
				this.router.navigate([`/${config.websiteSettings.templateId}`], { queryParams: this.queryParams });
			} else {
				if (this.queryParams) {
					this.router.navigate([this.currentPath], {
						queryParams: this.queryParams,
					});
				} else {
					this.router.navigate([this.currentPath]);
				}
			}
		} else {
			this.router.navigate(["/default"]);
		}
	}
}
