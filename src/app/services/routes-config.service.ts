import { HttpClient } from "@angular/common/http";
import { DOCUMENT, Inject, Injectable } from "@angular/core";
import { Route } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment.development";
import { templates } from "../templates";
import { SharedDataService } from "./shared-data.service";

@Injectable({
	providedIn: "root",
})
export class RoutesConfigService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		private sharedDataService: SharedDataService
	) {}

	loadSiteConfiguration(): Observable<Route> {
		const hostname = this.document.location.hostname;
		return this.http.get(`${environment.baseUrl}/customer/web`, { params: { domain: hostname } }).pipe(
			map((response: any) => {
				const { customer, mainMenu, sideMenu, team, cities, heroImages } = response.data;

				const templateId = customer.websiteSettings.templateId;
				if (customer.websiteSettings.primaryColor) {
					this.document.documentElement.style.setProperty(
						"--primary-color",
						customer.websiteSettings.primaryColor
					);
				}
				if (customer.websiteSettings.secondaryColor) {
					this.document.documentElement.style.setProperty(
						"--secondary-color",
						customer.websiteSettings.secondaryColor
					);
				}

				this.sharedDataService.setSiteData(customer);
				this.sharedDataService.setSiteId(customer.id);
				if (mainMenu) {
					this.sharedDataService.setMainMenu(mainMenu);
				}

				if (sideMenu) {
					this.sharedDataService.setSideMenu(sideMenu);
				}

				if (team) {
					this.sharedDataService.setTeam(team);
				}

				if (cities) {
					this.sharedDataService.setCities(cities);
				}

				if (heroImages) {
					this.sharedDataService.setHeroImages(heroImages);
				}

				return templates[templateId] || templates["t1"];
			}),
			catchError((error: any) => {
				console.error("Failed to load site configuration:", error);
				// return of(templates["t1"]);
				return [];
			})
		);
	}
}
