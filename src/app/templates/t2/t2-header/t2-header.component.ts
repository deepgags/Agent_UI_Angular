import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t2-header",
	imports: [AngularSvgIconModule, PhoneNumberPipe, RouterModule],
	templateUrl: "./t2-header.component.html",
	styleUrls: ["./t2-header.component.scss", "../t2.component.scss"],
})
export class T2HeaderComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;
	constructor() {}

	ngOnInit(): void {}
}
