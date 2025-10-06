import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SharedDataService } from "../../../services/shareddata.service";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";
import { CustomerModel } from "../../../models/CustomerModel";

@Component({
	selector: "app-t5-header",
	imports: [AngularSvgIconModule, PhoneNumberPipe, RouterModule],
	templateUrl: "./t5-header.component.html",
	styleUrls: ["./t5-header.component.scss", "../t5.component.scss"],
})
export class T5HeaderComponent implements OnInit {
		customer!: CustomerModel | null;
		siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();

	}
}
