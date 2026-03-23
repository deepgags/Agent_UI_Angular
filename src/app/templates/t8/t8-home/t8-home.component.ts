import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HeroContactFormComponent } from "../../../components/hero-contact-form/hero-contact-form.component";
import { TeamCardComponent } from "../../../components/team-card/team-card.component";
import { environment } from "../../../environments/environment.development";
import { City } from "../../../models/City";
import { CustomerModel } from "../../../models/CustomerModel";
import { HomeMetaModel } from "../../../models/HomeMeta";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneNumberFormatPipe } from "../../../pipes/phone-format";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t8-home",
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		SearchComponent,
		FeaturedPropertiesComponent,
		NgbModule,
		HeroContactFormComponent,
		PhoneNumberFormatPipe,
		TeamCardComponent,
	],
	templateUrl: "./t8-home.component.html",
	styleUrls: ["./t8-home.component.scss", "../t8.component.scss"],
	providers: [Title, StorageService],
})
export class T8HomeComponent implements OnInit {
	customer!: CustomerModel | null;
	siteConfig: SiteConfig = {} as SiteConfig;
	localImageUrl = environment.localImageUrl;
	private titleService = inject(Title);
	private metaService = inject(Meta);

	constructor(
		public sharedDataService: SharedDataService,
		private searchService: SearchService,
	) {}

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

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
