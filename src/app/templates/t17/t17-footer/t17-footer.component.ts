import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t17-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t17-footer.component.html",
	styleUrls: ["./t17-footer.component.scss", "../t17.component.scss"],
})
export class t17FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
