import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t18-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule],
	templateUrl: "./t18-header.component.html",
	styleUrls: ["./t18-header.component.scss", "../t18.component.scss"],
})
export class T18HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
