import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T23FooterComponent } from "./t23-footer/t23-footer.component";
import { T23HeaderComponent } from "./t23-header/t23-header.component";

@Component({
	selector: "app-t23",
	standalone: true,
	imports: [T23HeaderComponent, T23FooterComponent, RouterModule], 
	templateUrl: "./t23.component.html",
	styleUrl: "./t23.component.scss",
})
export class T23Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
