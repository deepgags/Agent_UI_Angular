import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t17-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t17-footer.component.html",
	styleUrls: ["./t17-footer.component.scss", "../t17.component.scss"],
})
export class t17FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;
	localImageUrl = environment.localImageUrl;

	constructor() {}

	ngOnInit(): void {}

	formatAddress(): string {
		const ci = this.siteConfig?.websiteSettings?.contactInfo;
		if (!ci) return '';
		return [ci.streetAddress, ci.municipality, ci.province, ci.postalCode]
			.filter(Boolean).join(', ');
	}
}
