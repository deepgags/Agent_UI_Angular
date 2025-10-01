import { Component } from "@angular/core";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-buyer",
	imports: [],
	templateUrl: "./buyer.component.html",
	styleUrl: "./buyer.component.scss",
})
export class BuyerComponent {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
