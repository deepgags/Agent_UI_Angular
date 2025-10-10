import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t13-header",
	imports: [AngularSvgIconModule, PhoneNumberPipe, RouterModule],
	templateUrl: "./t13-header.component.html",
	styleUrls: ["./t13-header.component.scss", "../t13.component.scss"],
})
export class T13HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
