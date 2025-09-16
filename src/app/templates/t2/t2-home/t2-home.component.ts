import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { SearchService } from "../../../services/search.service";
import { SiteConfigService } from "../../../services/site-config.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t2-home",
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent],
	templateUrl: "./t2-home.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./t2-home.component.scss", "../t2.component.scss"],
})
export class T2HomeComponent implements OnInit {
	customer: CustomerModel | undefined;
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;

	constructor(private titleService: Title, private siteConfigService: SiteConfigService, private searchService: SearchService) { }

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
