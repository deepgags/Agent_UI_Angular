import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t18-footer",
	imports: [PhoneNumberPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t18-footer.component.html",
	styleUrls: ["./t18-footer.component.scss", "../t18.component.scss"],
})
export class T18FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
