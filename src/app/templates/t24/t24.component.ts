import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T24FooterComponent } from "./t24-footer/t24-footer.component";
import { T24HeaderComponent } from "./t24-header/t24-header.component";

@Component({
	selector: "app-t24",
	standalone: true,
	imports: [T24HeaderComponent, T24FooterComponent, RouterModule], 
	templateUrl: "./t24.component.html",
	styleUrl: "./t24.component.scss",
})
export class T24Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
