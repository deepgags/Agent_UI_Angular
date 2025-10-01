import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shareddata.service";
import { T8FooterComponent } from "./t8-footer/t8-footer.component";
import { T8HeaderComponent } from "./t8-header/t8-header.component";

@Component({
	selector: "app-t8",
	standalone: true,
	imports: [T8HeaderComponent, T8FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t8.component.html",
	styleUrl: "./t8.component.scss",
})
export class T8Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
