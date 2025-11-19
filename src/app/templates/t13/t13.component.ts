import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T13FooterComponent } from "./t13-footer/t13-footer.component";
import { T13HeaderComponent } from "./t13-header/t13-header.component";

@Component({
	selector: "app-t13",
	standalone: true,
	imports: [T13HeaderComponent, T13FooterComponent, RouterModule],
	templateUrl: "./t13.component.html",
	styleUrl: "./t13.component.scss",
})
export class T13Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
