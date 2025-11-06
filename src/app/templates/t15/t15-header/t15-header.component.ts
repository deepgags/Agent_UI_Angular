import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t15-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule],
	templateUrl: "./t15-header.component.html",
	styleUrls: ["./t15-header.component.scss", "../t15.component.scss"],
})
export class T15HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
