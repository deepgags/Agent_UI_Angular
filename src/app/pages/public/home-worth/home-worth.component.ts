import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { GooglePlaceComponent } from "../../../components/google-place/google-place.component";
import { environment } from "../../../environments/environment.development";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-home-worth",
	imports: [GooglePlaceComponent],
	templateUrl: "./home-worth.component.html",
	styleUrl: "./home-worth.component.scss",
})
export class WorthComponent {
	siteConfig: SiteConfig = {} as SiteConfig;
	selectedPlace: any = null;
	rawAddress = "";
	localImageUrl = environment.localImageUrl;

	constructor(
		private sharedDataService: SharedDataService,
		private router: Router,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}

	onPlaceSelect = (place: any) => {
		this.selectedPlace = place;
	};

	onAddressChange = (address: string) => {
		this.rawAddress = address;
	};

	submitAddress = () => {
		const address = this.selectedPlace?.formatted_address || this.rawAddress.trim();

		if (!address) {
			this.notificationService.showError("Address is required.");
			return;
		}

		const lat = this.selectedPlace?.geometry?.location?.lat?.();
		const lng = this.selectedPlace?.geometry?.location?.lng?.();

		const queryParams: any = { address };
		if (lat !== undefined && lng !== undefined) {
			queryParams.lat = lat;
			queryParams.lng = lng;
		}

		this.router.navigate(["/home-review"], { queryParams });
	};
}
