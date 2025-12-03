import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T21FooterComponent } from "./t21-footer/t21-footer.component";
import { T21HeaderComponent } from "./t21-header/t21-header.component";

@Component({
	selector: "app-t21",
	standalone: true,
	imports: [T21HeaderComponent, T21FooterComponent, RouterModule], 
	templateUrl: "./t21.component.html",
	styleUrl: "./t21.component.scss",
})
export class t21Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
