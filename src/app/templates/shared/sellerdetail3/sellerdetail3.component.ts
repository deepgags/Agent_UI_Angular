import { Component } from "@angular/core";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-sellerdetail3",
	imports: [],
	templateUrl: "./sellerdetail3.component.html",
	styleUrl: "./sellerdetail3.component.scss",
})
export class Sellerdetail3Component {
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
