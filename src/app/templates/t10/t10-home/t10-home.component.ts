import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
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

declare var bootstrap: any;

@Component({
	selector: "app-t10-home",
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		SearchComponent,
		FeaturedPropertiesComponent,
		HeroContactFormComponent,
		PhoneNumberFormatPipe,
		TeamCardComponent,
	],
	templateUrl: "./t10-home.component.html",
	styleUrls: ["./t10-home.component.scss", "../t10.component.scss"],
	providers: [Title, StorageService],
})
export class T10HomeComponent implements OnInit, AfterViewInit {
	customer!: CustomerModel | null;
	userForm!: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;
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

	trackByIndex(index: number): number {
		return index;
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
