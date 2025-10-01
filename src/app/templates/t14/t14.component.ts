import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { T14FooterComponent } from "./t14-footer/t14-footer.component";
import { T14HeaderComponent } from "./t14-header/t14-header.component";
import { SharedDataService } from "../../services/shareddata.service";

@Component({
	selector: "app-t14",
	standalone: true,
	imports: [T14HeaderComponent, T14FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t14.component.html",
	styleUrl: "./t14.component.scss",
})
export class T14Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
