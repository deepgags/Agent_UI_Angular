import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t19-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t19-footer.component.html",
	styleUrls: ["./t19-footer.component.scss", "../t19.component.scss"],
})
export class T19FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
