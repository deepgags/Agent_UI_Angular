import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { RoutesConfigService } from "../services/routes-config.service";

@Injectable({
	providedIn: "root",
})
export class SiteDataResolver implements Resolve<any> {
	constructor(private routesConfigService: RoutesConfigService) {}

	resolve(): Observable<any> {
		return from(this.routesConfigService.loadSiteConfiguration()).pipe(
			map((route) => {
				return { loaded: true };
			}),
			catchError((error) => {
				console.error("Failed to load site configuration", error);
				return of({ loaded: false, error: error.message });
			}),
		);
	}
}
