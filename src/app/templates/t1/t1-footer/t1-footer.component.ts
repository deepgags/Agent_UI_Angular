import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";

@Component({
	selector: "app-t1-footer",
	imports: [PhoneNumberFormatPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t1-footer.component.html",
	styleUrls: ["./t1-footer.component.scss", "../t1.component.scss"],
})
export class T1FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
