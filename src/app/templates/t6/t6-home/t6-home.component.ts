import { Component, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { HeroContactFormComponent } from "../../../components/hero-contact-form/hero-contact-form.component";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t6-home",
	standalone: true,
	imports: [
		RouterModule,
		SearchComponent,
		FeaturedPropertiesComponent,
		PhoneNumberFormatPipe,
		HeroContactFormComponent,
		TeamCardComponent,
	],
	templateUrl: "./t6-home.component.html",
	styleUrls: ["./t6-home.component.scss", "../t6.component.scss"],
	providers: [Title, StorageService],
})
export class T6HomeComponent implements OnInit {
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
