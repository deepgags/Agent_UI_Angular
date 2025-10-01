import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HeroContactFormComponent } from "../../../components/hero-contact-form/hero-contact-form.component";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shareddata.service";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t12-home",
	standalone: true,
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, HeroContactFormComponent],
	templateUrl: "./t12-home.component.html",
	styleUrls: ["./t12-home.component.scss", "../t12.component.scss"],
	providers: [Title, StorageService],
})
export class T12HomeComponent implements OnInit {
	customer!: CustomerModel | null;
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(private titleService: Title, private searchService: SearchService, private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfig = this.sharedDataService.siteData();
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
