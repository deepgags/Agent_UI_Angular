import { Component, Input, OnInit } from "@angular/core";
import { AngularSvgIconModule } from "angular-svg-icon";

import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t7-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t7-footer.component.html",
	styleUrls: ["./t7-footer.component.scss", "../t7.component.scss"],
})
export class T7FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;
	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
