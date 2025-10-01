import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t19-header",
	imports: [AngularSvgIconModule, PhoneNumberPipe, RouterModule],
	templateUrl: "./t19-header.component.html",
	styleUrls: ["./t19-header.component.scss", "../t19.component.scss"],
})
export class T19HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
