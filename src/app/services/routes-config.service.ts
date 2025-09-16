import { HttpClient } from "@angular/common/http";
import { DOCUMENT, Inject, Injectable } from "@angular/core";
import { Route } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment.development";
import { templates } from "../templates";

@Injectable({
	providedIn: "root",
})
export class RoutesConfigService {

	constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) { }

	loadSiteConfiguration(): Observable<Route[]> {
		const hostname = this.document.location.hostname;
		return this.http.get(`${environment.baseUrl}/customer/web`, { params: { domain: hostname } }).pipe(
			map((response: any) => {
				const config: any = response.data;
				const templateId = config.websiteSettings.templateId;
				if (config.websiteSettings.primaryColor) {
					document.documentElement.style.setProperty("--primary-color", config.websiteSettings.primaryColor);
				}
				if (config.websiteSettings.secondaryColor) {
					document.documentElement.style.setProperty("--secondary-color", config.websiteSettings.secondaryColor);
				}
				return templates[templateId] || templates["t1"];
			}),
			catchError((error: any) => {
				console.error("Failed to load site configuration:", error);
				return of(templates["t1"]);
			})
		);
	}
}
