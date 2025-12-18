import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T22FooterComponent } from "./t22-footer/t22-footer.component";
import { T22HeaderComponent } from "./t22-header/t22-header.component";

@Component({
	selector: "app-t22",
	standalone: true,
	imports: [T22HeaderComponent, T22FooterComponent, RouterModule], 
	templateUrl: "./t22.component.html",
	styleUrl: "./t22.component.scss",
})
export class T22Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
