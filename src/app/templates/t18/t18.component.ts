import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T18FooterComponent } from "./t18-footer/t18-footer.component";
import { T18HeaderComponent } from "./t18-header/t18-header.component";

@Component({
	selector: "app-t18",
	standalone: true,
	imports: [T18FooterComponent, T18HeaderComponent, RouterModule], // Added CommonModule
	templateUrl: "./t18.component.html",
	styleUrl: "./t18.component.scss",
})
export class T18Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
