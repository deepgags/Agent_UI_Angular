import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { GooglePlaceComponent } from "../../../components/google-place/google-place.component";
import { environment } from "../../../environments/environment.development";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-dream-home",
	imports: [GooglePlaceComponent],
	templateUrl: "./dream-home.component.html",
	styleUrl: "./dream-home.component.scss",
})
export class DreamComponent {
	siteConfig: SiteConfig = {} as SiteConfig;
	selectedPlace: any = null;
	localImageUrl = environment.localImageUrl;

	constructor(private router: Router, private sharedDataService: SharedDataService) {}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}
	onPlaceSelect = (place: any) => {
		this.selectedPlace = place;
	};

	submitAddress = () => {
		if (!this.selectedPlace) {
			alert("Please select an address first.");
			return;
		}

		const address = this.selectedPlace.formatted_address;
		const lat = this.selectedPlace.geometry.location.lat();
		const lng = this.selectedPlace.geometry.location.lng();

		this.router.navigate(["/home-detail"], {
			queryParams: {
				address: address,
				lat: lat,
				lng: lng,
			},
		});
	};
}
