import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t22-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t22-footer.component.html",
	styleUrls: ["./t22-footer.component.scss", "../t22.component.scss"],
})
export class T22FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;
	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
