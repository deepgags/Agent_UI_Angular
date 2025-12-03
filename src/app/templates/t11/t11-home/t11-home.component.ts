import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CustomerModel } from "../../../models/CustomerModel";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";
import { HeroContactFormComponent } from "../../../components/hero-contact-form/hero-contact-form.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";

@Component({
	selector: "app-t11-home",
	standalone: true,
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, HeroContactFormComponent,TeamCardComponent],
	templateUrl: "./t11-home.component.html",
	styleUrls: ["./t11-home.component.scss", "../t11.component.scss"],
	providers: [Title, StorageService],
})
export class T11HomeComponent implements OnInit {
	customer!: CustomerModel | null;
	siteConfig: SiteConfig = {} as SiteConfig;

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
