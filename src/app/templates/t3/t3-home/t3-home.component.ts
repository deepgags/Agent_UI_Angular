import { AfterViewInit, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";
import { environment } from "../../../environments/environment.development";
import { City } from "../../../models/City";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

declare var bootstrap: any;

@Component({
	selector: "app-t3-home",
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, PhoneNumberFormatPipe, TeamCardComponent],
	templateUrl: "./t3-home.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./t3-home.component.scss", "../t3.component.scss"],
})
export class T3HomeComponent implements OnInit, AfterViewInit {
	customer: CustomerModel | undefined;
	siteConfig: SiteConfig = {} as SiteConfig;
	siteConfigSubscription: any;
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

	ngAfterViewInit(): void {
		const carouselEl = document.querySelector("#carouselExampleAutoplaying");
		if (carouselEl) {
			new bootstrap.Carousel(carouselEl, {
				interval: 2500,
				ride: "carousel",
				pause: false,
				wrap: true,
			});
		}
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
