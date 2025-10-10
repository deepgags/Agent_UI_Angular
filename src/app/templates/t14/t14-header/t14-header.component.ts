import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t14-header",
	imports: [AngularSvgIconModule, PhoneNumberPipe, RouterModule],
	templateUrl: "./t14-header.component.html",
	styleUrls: ["./t14-header.component.scss", "../t14.component.scss"],
})
export class T14HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | any;

	constructor() {}

	ngOnInit(): void {}
}
