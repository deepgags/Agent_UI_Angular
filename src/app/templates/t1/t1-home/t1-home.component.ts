import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shareddata.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t1-home",
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, PhoneNumberFormatPipe],
	templateUrl: "./t1-home.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./t1-home.component.scss", "../t1.component.scss"],
})
export class T1HomeComponent implements OnInit {
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
