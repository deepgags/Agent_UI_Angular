import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t4-footer",
	imports: [PhoneNumberPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t4-footer.component.html",
	styleUrls: ["./t4-footer.component.scss", "../t4.component.scss"],
})
export class T4FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;

	constructor() {}

	ngOnInit(): void {}
}
