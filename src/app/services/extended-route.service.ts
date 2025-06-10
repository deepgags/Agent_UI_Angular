import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class ExtendedRouteService {
	constructor(private router: Router) {}

	navigateToSharedPage(pagePath: string) {
		const currentUrl = this.router.url.split("/")[1];
		this.router.navigate([currentUrl, pagePath]);
	}
}
