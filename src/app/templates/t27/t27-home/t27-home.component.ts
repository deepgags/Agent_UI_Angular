import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";
import { environment } from "../../../environments/environment.development";
import { City } from "../../../models/City";
import { CustomerModel } from "../../../models/CustomerModel";
import { HomeMetaModel } from "../../../models/HomeMeta";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

declare var bootstrap: any;

@Component({
	selector: "app-t27-home",
	imports: [
		RouterModule,
		SearchComponent,
		FeaturedPropertiesComponent,
		PhoneNumberFormatPipe,
		TeamCardComponent,
		CommonModule,
	],
	templateUrl: "./t27-home.component.html",
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./t27-home.component.scss", "../t27.component.scss"],
})
export class T27HomeComponent implements OnInit, AfterViewInit {
	customer: CustomerModel | undefined;
	siteConfig: SiteConfig = {} as SiteConfig;
	siteConfigSubscription: any;
	localImageUrl = environment.localImageUrl;
	private titleService = inject(Title);
	private metaService = inject(Meta);

	constructor(private sharedDataService: SharedDataService, private searchService: SearchService) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfig = this.sharedDataService.siteData();
		const homeMeta: HomeMetaModel = this.sharedDataService.homeMeta();
		this.titleService.setTitle(homeMeta.metaTitle);
		if (homeMeta.metaDescription) {
			this.metaService.updateTag({ name: "description", content: homeMeta.metaDescription });
		}
		if (homeMeta.keywords) {
			this.metaService.updateTag({ name: "keywords", content: homeMeta.keywords });
		}
	}

	get cities(): City[] {
		return this.sharedDataService.cities();
	}

	get heroImages(): string[] {
		return this.sharedDataService.heroImages();
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			const carouselEl = document.querySelector("#heroCarousel");
			if (carouselEl) {
				new bootstrap.Carousel(carouselEl);
			}
		}, 200);
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
