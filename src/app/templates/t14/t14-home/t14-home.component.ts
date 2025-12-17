import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { HeroContactFormComponent } from "../../../components/hero-contact-form/hero-contact-form.component";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";
import { environment } from "../../../environments/environment.development";
import { City } from "../../../models/City";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t14-home",
	standalone: true,
	imports: [
		RouterModule,
		SearchComponent,
		FeaturedPropertiesComponent,
		HeroContactFormComponent,
		PhoneNumberFormatPipe,
		TeamCardComponent,
	],
	templateUrl: "./t14-home.component.html",
	styleUrls: ["./t14-home.component.scss", "../t14.component.scss"],
	providers: [Title, StorageService],
})
export class T14HomeComponent implements OnInit {
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

	get cities(): City[] {
		return this.sharedDataService.cities();
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
