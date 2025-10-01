import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shareddata.service";
import { T19FooterComponent } from "./t19-footer/t19-footer.component";
import { T19HeaderComponent } from "./t19-header/t19-header.component";

@Component({
	selector: "app-t19",
	standalone: true,
	imports: [T19FooterComponent, T19HeaderComponent, RouterModule],
	templateUrl: "./t19.component.html",
	styleUrl: "./t19.component.scss",
})
export class T19Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
