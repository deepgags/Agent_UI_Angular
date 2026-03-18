import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T26FooterComponent } from "./t26-footer/t26-footer.component";
import { T26HeaderComponent } from "./t26-header/t26-header.component";

@Component({
	selector: "app-t26",
	standalone: true,
	imports: [T26HeaderComponent, T26FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t26.component.html",
	styleUrl: "./t26.component.scss",
})
export class T26Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
