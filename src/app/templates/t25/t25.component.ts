import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T25FooterComponent } from "./t25-footer/t25-footer.component";
import { T25HeaderComponent } from "./t25-header/t25-header.component";

@Component({
	selector: "app-t25",
	standalone: true,
	imports: [T25HeaderComponent, T25FooterComponent, RouterModule], 
	templateUrl: "./t25.component.html",
	styleUrl: "./t25.component.scss",
})
export class T25Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
