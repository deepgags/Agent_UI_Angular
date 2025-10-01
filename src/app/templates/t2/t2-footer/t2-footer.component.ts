import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";

@Component({
	selector: "app-t2-footer",
	imports: [PhoneNumberPipe, AngularSvgIconModule, RouterModule],
	templateUrl: "./t2-footer.component.html",
	styleUrls: ["./t2-footer.component.scss", "../t2.component.scss"],
})
export class T2FooterComponent implements OnInit {
	@Input("siteConfig") siteConfig: SiteConfig | null = null;
	constructor() {}

	ngOnInit(): void {}
}
