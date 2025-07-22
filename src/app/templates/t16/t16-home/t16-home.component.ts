import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CustomerModel } from "../../../models/CustomerModel";
import { StorageService } from "../../../services/storage.service";
import { FeaturedPropertiesComponent } from "../../shared/featured-properties/featured-properties.component";
import { SearchComponent } from "../../shared/search/search.component";
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SiteConfig } from "../../../models/SiteConfig";
import { SiteConfigService } from "../../../services/site-config.service";

@Component({
	selector: "app-t16-home",
	standalone: true,
	imports: [
		RouterModule,
		SearchComponent,
		FeaturedPropertiesComponent,
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: "./t16-home.component.html",
	styleUrls: ["./t16-home.component.scss", "../t16.component.scss"],
	providers: [Title, StorageService],
})
export class T16HomeComponent implements OnInit {
	customer!: CustomerModel | null;
	userForm!: FormGroup;
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;
	// siteConfigService: any;
	constructor(private router: Router, private fb: FormBuilder, private titleService: Title,private siteConfigService: SiteConfigService) {}

	ngOnInit(): void {
		this.titleService.setTitle("Home");
		this.userForm = this.fb.group({
			firstName: new FormControl("", Validators.required),
			phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			comment: new FormControl("", Validators.required),
		});
	
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;

		searchByMap = selectedFilters["searchByMap"] || searchByMap;
		this.router.navigate(["/t16", searchByMap ? "map" : "search"], {
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
