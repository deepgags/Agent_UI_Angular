import { Component, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HeroContactFormComponent } from "../../../components/hero-contact-form/hero-contact-form.component";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";

@Component({
	selector: "app-t7-home",
	standalone: true,
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, NgbModule, HeroContactFormComponent,TeamCardComponent],
	templateUrl: "./t7-home.component.html",
	styleUrls: ["./t7-home.component.scss", "../t7.component.scss"],
	providers: [Title, StorageService],
})
export class T7HomeComponent implements OnInit {
	customer!: CustomerModel | null;
	siteConfig: SiteConfig = {} as SiteConfig;
localImageUrl = environment.localImageUrl;
	constructor(
		private titleService: Title,
		private sharedDataService: SharedDataService,
		private searchService: SearchService
	) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfig = this.sharedDataService.siteData();
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
