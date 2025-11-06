import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t1-header",
	imports: [AngularSvgIconModule, PhoneNumberFormatPipe, RouterModule],
	templateUrl: "./t1-header.component.html",
	styleUrls: ["./t1-header.component.scss", "../t1.component.scss"],
})
export class T1HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
