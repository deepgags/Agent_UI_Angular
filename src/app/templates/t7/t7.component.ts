import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T7FooterComponent } from "./t7-footer/t7-footer.component";
import { T7HeaderComponent } from "./t7-header/t7-header.component";

@Component({
	selector: "app-t7",
	standalone: true,
	imports: [T7HeaderComponent, T7FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t7.component.html",
	styleUrl: "./t7.component.scss",
})
export class T7Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
