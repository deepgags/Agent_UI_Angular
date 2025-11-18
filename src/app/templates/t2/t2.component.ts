import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T2FooterComponent } from "./t2-footer/t2-footer.component";
import { T2HeaderComponent } from "./t2-header/t2-header.component";

@Component({
	selector: "app-t2",
	imports: [T2HeaderComponent, T2FooterComponent, RouterModule],
	templateUrl: "./t2.component.html",
	styleUrl: "./t2.component.scss",
})
export class T2Component {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
