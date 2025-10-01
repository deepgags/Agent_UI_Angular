import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shareddata.service";
import { T15FooterComponent } from "./t15-footer/t15-footer.component";
import { T15HeaderComponent } from "./t15-header/t15-header.component";

@Component({
	selector: "app-t15",
	standalone: true,
	imports: [T15HeaderComponent, T15FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t15.component.html",
	styleUrl: "./t15.component.scss",
})
export class T15Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
