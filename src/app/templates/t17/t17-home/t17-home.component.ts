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
import { PhoneNumberPipe } from "../../../pipes/phoneSearch";
import { SearchService } from "../../../services/search.service";
import { SharedDataService } from "../../../services/shareddata.service";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
	selector: "app-t17-home",
	standalone: true,
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent, PhoneNumberPipe, HeroContactFormComponent],
	templateUrl: "./t17-home.component.html",
	styleUrls: ["./t17-home.component.scss", "../t17.component.scss"],
	providers: [Title, StorageService],
})
export class T17HomeComponent implements OnInit {
	customer!: CustomerModel | null;
	userForm!: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;
	siteConfigSubscription: any;
	constructor(private titleService: Title, private sharedDataService: SharedDataService, private searchService: SearchService) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.siteConfig = this.sharedDataService.siteData();
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		this.searchService.goToSearch(selectedFilters, searchByMap);
	};
}
