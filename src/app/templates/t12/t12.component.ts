import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { T12FooterComponent } from "./t12-footer/t12-footer.component";
import { T12HeaderComponent } from "./t12-header/t12-header.component";
import { SharedDataService } from "../../services/shareddata.service";

@Component({
	selector: "app-t12",
	standalone: true,
	imports: [T12HeaderComponent, T12FooterComponent, RouterModule],
	templateUrl: "./t12.component.html",
	styleUrl: "./t12.component.scss",
})
export class T12Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
