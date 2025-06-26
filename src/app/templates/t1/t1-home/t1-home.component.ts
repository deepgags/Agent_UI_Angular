import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneSearch } from "../../../pipes/phoneSearch";
import { SiteConfigService } from "../../../services/site-config.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t1-home",
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, PhoneSearch],
	templateUrl: "./t1-home.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./t1-home.component.scss", "../t1.component.scss"],
})
export class T1HomeComponent implements OnInit {
	customer: CustomerModel | undefined;
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;

	constructor(private router: Router, private titleService: Title, private siteConfigService: SiteConfigService) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;

		searchByMap = selectedFilters["searchByMap"] || searchByMap;
		this.router.navigate(["/t1", searchByMap ? "map" : "search"], {
			queryParams: {
				address,
				property_type,
				bedrooms,
				bathrooms,
				min_price,
				max_price,
				property_status,
				sqFt,
			},
		});
	};
}
