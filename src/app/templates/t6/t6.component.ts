import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T6FooterComponent } from "./t6-footer/t6-footer.component";
import { T6HeaderComponent } from "./t6-header/t6-header.component";

@Component({
	selector: "app-t6",
	standalone: true,
	imports: [T6HeaderComponent, T6FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t6.component.html",
	styleUrl: "./t6.component.scss",
})
export class T6Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
