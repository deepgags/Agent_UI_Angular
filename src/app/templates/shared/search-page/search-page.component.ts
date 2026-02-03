import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { BehaviorSubject } from "rxjs";
import { PropertyComponent } from "../../../components/property/property.component";
import { sortTypes } from "../../../consts/DefaultTypes";
import { stringiFy } from "../../../consts/Utility";
import { PropertyModel } from "../../../models/PropertyModel";
import { LoadingService } from "../../../services/loading.service";
import { PropertyService } from "../../../services/property.service";
import { SearchComponent } from "../search/search.component";

@Component({
	selector: "app-search-page",
	imports: [
		FormsModule,
		CommonModule,
		SearchComponent,
		RouterModule,
		PaginatorModule,
		ProgressSpinnerModule,
		PropertyComponent,
	],
	templateUrl: "./search-page.component.html",
	styleUrls: ["./search-page.component.scss"],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [DialogService],
})
export class SearchPageComponent implements OnInit {
	propertiesList: PropertyModel[] | undefined;
	pageIndex: number = 1;
	pageSize: number = 24;
	private loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();

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
		sort: "Most",
		city: "",
	};

	sortDropDown = sortTypes;

	constructor(
		private route: ActivatedRoute,
		private propertyService: PropertyService,
		public loadingService: LoadingService,
		private titleService: Title,
	) {
		this.titleService.setTitle("Search Properties");
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			if (Object.keys(params).length > 0) {
				this.selectedFilters = {
					...this.selectedFilters,
					...params,
				};
				this.searchProperties(this.selectedFilters);
			}
		});
	}

	selectProperty = (property: PropertyModel): void => {
		this.propertyService.selectProperty(property, this.selectedFilters);
	};

	sortChange(sort: any): void {
		this.selectedFilters.sort = sort;
		this.searchProperties(this.selectedFilters);
	}

	searchProperties = (selectedFilters: any, event?: any) => {
		this.pageIndex = event ? event.page + 1 : this.pageIndex;
		this.pageSize = event?.rows ?? this.pageSize;

		const sort = selectedFilters.sort && selectedFilters.sort != "" ? selectedFilters.sort : "most";

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
			sort: sort,
			city: stringiFy(selectedFilters.city),
		};

		this.loadingService.loadingOn();
		this.loadingSubject.next(true);
		this.propertyService.searchProperties(params).subscribe({
			next: (response) => {
				this.propertiesList = response;
			},
			error: (err) => {
				// this.notificationService.showNotification("Error occurred while getting properties");
			},
			complete: () => {
				this.loadingSubject.next(false);
			},
		});
		return event;
	};
}
