import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T20FooterComponent } from "./t20-footer/t20-footer.component";
import { T20HeaderComponent } from "./t20-header/t20-header.component";

@Component({
	selector: "app-t20",
	standalone: true,
	imports: [T20FooterComponent, T20HeaderComponent, RouterModule],
	templateUrl: "./t20.component.html",
	styleUrl: "./t20.component.scss",
})
export class T20Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
