import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T4FooterComponent } from "./t4-footer/t4-footer.component";
import { T4HeaderComponent } from "./t4-header/t4-header.component";

@Component({
	selector: "app-t4",
	standalone: true,
	imports: [T4HeaderComponent, T4FooterComponent, RouterModule],
	templateUrl: "./t4.component.html",
	styleUrl: "./t4.component.scss",
})
export class T4Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
