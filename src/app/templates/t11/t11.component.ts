import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shareddata.service";
import { T11FooterComponent } from "./t11-footer/t11-footer.component";
import { T11HeaderComponent } from "./t11-header/t11-header.component";

@Component({
	selector: "app-t11",
	standalone: true,
	imports: [T11HeaderComponent, T11FooterComponent, RouterModule],
	templateUrl: "./t11.component.html",
	styleUrl: "./t11.component.scss",
})
export class T11Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
