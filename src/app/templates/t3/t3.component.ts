import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T3FooterComponent } from "./t3-footer/t3-footer.component";
import { T3HeaderComponent } from "./t3-header/t3-header.component";

@Component({
	selector: "app-t3",
	imports: [T3HeaderComponent, T3FooterComponent, RouterModule],
	templateUrl: "./t3.component.html",
	styleUrl: "./t3.component.scss",
})
export class T3Component {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
