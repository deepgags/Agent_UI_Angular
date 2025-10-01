import { Component } from "@angular/core";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-sellerdetail2",
	imports: [],
	templateUrl: "./sellerdetail2.component.html",
	styleUrl: "./sellerdetail2.component.scss",
})
export class Sellerdetail2Component {
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
