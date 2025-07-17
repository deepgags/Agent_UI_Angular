import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { SiteConfig } from "../../../models/SiteConfig";
import { SiteConfigService } from "../../../services/site-config.service";

@Component({
	selector: "app-sellerdetail3",
	imports: [CommonModule],
	templateUrl: "./sellerdetail3.component.html",
	styleUrl: "./sellerdetail3.component.scss",
})
export class Sellerdetail3Component {
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;

	constructor(private siteConfigService: SiteConfigService) {}

	ngOnInit() {
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}

	ngOnDestroy(): void {
		if (this.siteConfigSubscription) {
			this.siteConfigSubscription.unsubscribe();
		}
	}
}
