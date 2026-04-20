import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T28FooterComponent } from "./t28-footer/t28-footer.component";
import { T28HeaderComponent } from "./t28-header/t28-header.component";

@Component({
	selector: "app-t28",
	standalone: true,
	imports: [T28HeaderComponent, T28FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t28.component.html",
	styleUrl: "./t28.component.scss",
})
export class T28Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
