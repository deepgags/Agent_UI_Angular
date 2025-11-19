import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T10FooterComponent } from "./t10-footer/t10-footer.component";
import { T10HeaderComponent } from "./t10-header/t10-header.component";

@Component({
	selector: "app-t10",
	standalone: true,
	imports: [T10HeaderComponent, T10FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t10.component.html",
	styleUrl: "./t10.component.scss",
})
export class T10Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
