import { Component } from "@angular/core";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-sellerdetail",
	imports: [],
	templateUrl: "./sellerdetail.component.html",
	styleUrl: "./sellerdetail.component.scss",
})
export class SellerdetailComponent {
	siteConfig: SiteConfig = {} as SiteConfig;
	siteConfigSubscription: any;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}

	ngOnDestroy(): void {
		if (this.siteConfigSubscription) {
			this.siteConfigSubscription.unsubscribe();
		}
	}
}
