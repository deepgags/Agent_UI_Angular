import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SiteConfig } from "../../models/SiteConfig";
import { SharedDataService } from "../../services/shareddata.service";
import { T1FooterComponent } from "./t1-footer/t1-footer.component";
import { T1HeaderComponent } from "./t1-header/t1-header.component";

@Component({
	selector: "app-t1",
	standalone: true,
	imports: [T1HeaderComponent, T1FooterComponent, RouterModule], // Added CommonModule
	templateUrl: "./t1.component.html",
	styleUrl: "./t1.component.scss",
})
export class T1Component implements OnInit {
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteConfig = this.sharedDataService.siteData();
	}
}
