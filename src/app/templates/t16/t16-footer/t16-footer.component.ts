import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t16-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t16-footer.component.html",
	styleUrls: ["./t16-footer.component.scss", "../t16.component.scss"],
})
export class T16FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
