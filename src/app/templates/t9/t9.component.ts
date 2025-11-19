import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T9FooterComponent } from "./t9-footer/t9-footer.component";
import { T9HeaderComponent } from "./t9-header/t9-header.component";

@Component({
	selector: "app-t9",
	standalone: true,
	imports: [T9HeaderComponent, T9FooterComponent, RouterModule],
	templateUrl: "./t9.component.html",
	styleUrl: "./t9.component.scss",
})
export class T9Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
