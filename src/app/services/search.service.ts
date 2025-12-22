import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class SearchService {
	constructor(private router: Router) {}

	goToSearch(selectedFilters: any, searchByMap: boolean = false) {
		const {
			address,
			property_type,
			property_subtype,
			bedrooms,
			bathrooms,
			min_price,
			max_price,
			property_status,
			sqFt,
			city,
		} = selectedFilters;

		searchByMap = selectedFilters["searchByMap"] || searchByMap;
		// this.router.navigate([navigatePath, searchByMap ? "map" : "search"], {
		this.router.navigate([searchByMap ? "map" : "search"], {
			queryParams: {
				address,
				property_type,
				property_subtype,
				bedrooms,
				bathrooms,
				min_price,
				max_price,
				property_status,
				sqFt,
				city,
			},
		});
	}
}
