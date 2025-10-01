import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t18-header",
	imports: [AngularSvgIconModule, PhoneNumberPipe, RouterModule],
	templateUrl: "./t18-header.component.html",
	styleUrls: ["./t18-header.component.scss", "../t18.component.scss"],
})
export class T18HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
