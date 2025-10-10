import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t17-header",
	imports: [AngularSvgIconModule, PhoneNumberPipe, RouterModule],
	templateUrl: "./t17-header.component.html",
	styleUrls: ["./t17-header.component.scss", "../t17.component.scss"],
})
export class t17HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
