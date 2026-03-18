import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shared-data.service";
import { T27FooterComponent} from "./t27-footer/t27-footer.component";
import { T27HeaderComponent } from "./t27-header/t27-header.component";

@Component({
	selector: "app-t27",
	standalone: true,
	imports: [T27HeaderComponent, T27FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t27.component.html",
	styleUrl: "./t27.component.scss",
})
export class T27Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
