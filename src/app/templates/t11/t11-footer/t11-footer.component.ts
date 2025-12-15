import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { environment } from "../../../environments/environment.development";

@Component({
	selector: "app-t11-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t11-footer.component.html",
	styleUrls: ["./t11-footer.component.scss", "../t11.component.scss"],
})
export class T11FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	localImageUrl = environment.localImageUrl;
	constructor() {}

	ngOnInit(): void {}
}
