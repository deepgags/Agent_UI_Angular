import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t14-footer",
	imports: [PhoneNumberPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t14-footer.component.html",
	styleUrls: ["./t14-footer.component.scss", "../t14.component.scss"],
})
export class T14FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
