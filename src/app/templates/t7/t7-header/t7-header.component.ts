import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t7-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule],
	templateUrl: "./t7-header.component.html",
	styleUrls: ["./t7-header.component.scss", "../t7.component.scss"],
})
export class T7HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
