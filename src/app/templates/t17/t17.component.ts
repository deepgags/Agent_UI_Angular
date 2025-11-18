import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subscription } from "rxjs";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { t17FooterComponent } from "./t17-footer/t17-footer.component";
import { t17HeaderComponent } from "./t17-header/t17-header.component";

@Component({
	selector: "app-t17",
	standalone: true,
	imports: [t17FooterComponent, t17HeaderComponent, RouterModule],
	templateUrl: "./t17.component.html",
	styleUrl: "./t17.component.scss",
})
export class T17Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
