import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shareddata.service";
import { T16FooterComponent } from "./t16-footer/t16-footer.component";
import { T16HeaderComponent } from "./t16-header/t16-header.component";

@Component({
	selector: "app-t16",
	standalone: true,
	imports: [T16HeaderComponent, T16FooterComponent, RouterModule],
	templateUrl: "./t16.component.html",
	styleUrl: "./t16.component.scss",
})
export class T16Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
