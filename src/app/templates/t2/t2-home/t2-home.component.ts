import { Component, OnInit, ViewEncapsulation,AfterViewInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CustomerModel } from "../../../models/CustomerModel";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

declare var bootstrap: any;

@Component({
	selector: "app-t2-home",
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, PhoneNumberFormatPipe,TeamCardComponent],
	templateUrl: "./t2-home.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./t2-home.component.scss", "../t2.component.scss"],
})
export class T2HomeComponent implements OnInit ,AfterViewInit {
	customer: CustomerModel | undefined;
	siteConfig: SiteConfig = {} as SiteConfig;
	siteConfigSubscription: any;

	constructor(
		private titleService: Title,
		private sharedDataService: SharedDataService,
		private searchService: SearchService
	) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfig = this.sharedDataService.siteData();
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
		/*
		const { address, property_type, property_subtype, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
		searchByMap = selectedFilters["searchByMap"] || searchByMap;
		this.router.navigate([, searchByMap ? "map" : "search"], {
			queryParams: {
				address,
				property_type,
				property_subtype,
				bedrooms,
				bathrooms,
				min_price,
				max_price,
				property_status,
				sqFt,
			},
		});
		*/
	};
}
