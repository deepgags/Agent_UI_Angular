import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t9-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t9-footer.component.html",
	styleUrls: ["./t9-footer.component.scss", "../t9.component.scss"],
})
export class T9FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
