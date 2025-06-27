import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneSearch } from "../../../pipes/phoneSearch";
import { SiteConfigService } from "../../../services/site-config.service";

@Component({
	selector: "app-about",
	imports: [RouterModule, PhoneSearch],
	templateUrl: "./about.component.html",
	styleUrl: "./about.component.scss",
})
export class AboutComponent {
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;

	aboutText =
		" I believe every client has the right to be treated fairly, honestly and with integrity. My aim is to educate and prepare my clients to insure that they are always in a position to make informed decisions. Every engagement is an opportunity to create a lasting impression and a forever client. Ajay is a well serving in real estate with the reputation of providing quality services and keeping excellent relations with the clients. My intend to provide our clients with the best personalized real estate experience from beginning to end. I enjoy sharing my expertise by giving you the scoop on the local real estate market. My aim is to guide & prepare our clients to ensure that they are always in a position to make informed decision. I put our client’s interest above everything. I am professionally trained and licensed realtors who work for seeking to experience satisfaction and feel good emotions.";

	constructor(private siteConfigService: SiteConfigService) {}

	ngOnInit(): void {
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}
}
