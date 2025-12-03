import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";

@Component({
	selector: "app-t16-home",
	standalone: true,
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent,TeamCardComponent],
	templateUrl: "./t16-home.component.html",
	styleUrls: ["./t16-home.component.scss", "../t16.component.scss"],
	providers: [Title, StorageService],
})
export class T16HomeComponent implements OnInit {
	customer!: CustomerModel | null;
	siteConfig: SiteConfig = {} as SiteConfig;
	siteConfigSubscription: any;
	constructor(
		private titleService: Title,
		private searchService: SearchService,
		private sharedDataService: SharedDataService
	) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfig = this.sharedDataService.siteData();
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
