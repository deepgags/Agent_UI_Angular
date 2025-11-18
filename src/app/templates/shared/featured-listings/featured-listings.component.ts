import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { PropertyComponent } from "../../../components/property/property.component";
import { stringiFy } from "../../../consts/Utility";
import { environment } from "../../../environments/environment.development";
import { PropertyModel } from "../../../models/PropertyModel";
import { LoadingService } from "../../../services/loading.service";
import { PropertyService } from "../../../services/property.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { SearchComponent } from "../search/search.component";

@Component({
	selector: "app-featured-listings",
	imports: [
		FormsModule,
		CommonModule,
		MatIconModule,
		SearchComponent,
		RouterModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		PropertyComponent,
		ProgressSpinnerModule,
	],
	templateUrl: "./featured-listings.component.html",
	styleUrl: "./featured-listings.component.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [DialogService],
})
export class FeaturedListingsComponent implements OnInit {
	imageUrl = environment.imageUrl;
	propertiesList: PropertyModel[] | null = null;
	pageEvent: PageEvent | undefined;
	pageIndex: number = 1;
	pageSize: number = 12;

	siteId: string = "";
	selectedFilters: any = {
		address: "",
		property_type: "",
		property_subtype: "",
		bedrooms: "0",
		bathrooms: "0",
		min_price: "",
		max_price: "",
		property_status: "",
		sqFt: "",
		distance: "20",
		sort: "",
	};

	constructor(
		private propertyService: PropertyService,
		public loadingService: LoadingService,
		private titleService: Title,
		private sharedDataService: SharedDataService,
		private cdr: ChangeDetectorRef
	) {
		this.titleService.setTitle("Search Properties");
	}

	ngOnInit(): void {
		this.siteId = this.sharedDataService.siteId();
		this.pageIndex = 1;
		this.pageSize = 12;
		this.searchProperties({});
	}

	selectProperty = (property: PropertyModel): void => {
		this.propertyService.selectProperty(property, this.selectedFilters);
	};

	searchProperties = (selectedFilters: any, event?: PageEvent) => {
		this.pageIndex = event ? event.pageIndex + 1 : this.pageIndex;
		this.pageSize = event?.pageSize ?? this.pageSize;
		const params = {
			page: this.pageIndex,
			pageSize: this.pageSize,
			address: stringiFy(selectedFilters.address),
			property_type: stringiFy(selectedFilters.property_type),
			property_subtype: stringiFy(selectedFilters.property_subtype),
			bedrooms: stringiFy(selectedFilters.bedrooms),
			bathrooms: stringiFy(selectedFilters.bathrooms),
			property_for: stringiFy(selectedFilters.property_status),
			min_price: stringiFy(selectedFilters.min_price),
			max_price: stringiFy(selectedFilters.max_price),
			sqFt: stringiFy(selectedFilters.sqFt),
			distance: stringiFy(selectedFilters.distance),
			// brokerageType: userInfo?.brokerage?.alternateName,
			// propertyFeedType: "IDX",
			sort: "",
			siteId: this.siteId,
		};

		// this.loadingService.loadingOn();
		this.propertyService.featuredProperties(params).subscribe({
			next: (response) => {
				this.propertiesList = response;
				this.cdr.detectChanges();
			},
			error: (err) => {
				this.propertiesList = [];
			},
			complete: () => {},
		});
		return event;
	};
}
