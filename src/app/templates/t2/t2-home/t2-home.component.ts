import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shareddata.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t2-home",
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, PhoneNumberFormatPipe, CommonModule],
	templateUrl: "./t2-home.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./t2-home.component.scss", "../t2.component.scss"],
})
export class T2HomeComponent implements OnInit {
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
	};
}
