import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shareddata.service";
import { T5FooterComponent } from "./t5-footer/t5-footer.component";
import { T5HeaderComponent } from "./t5-header/t5-header.component";

@Component({
	selector: "app-t5",
	standalone: true,
	imports: [T5HeaderComponent, T5FooterComponent, RouterModule],
	templateUrl: "./t5.component.html",
	styleUrl: "./t5.component.scss",
})
export class T5Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
