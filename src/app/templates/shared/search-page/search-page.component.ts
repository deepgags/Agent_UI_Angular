import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { BehaviorSubject } from "rxjs";
import { InterestedUserComponent } from "../../../components/dialogs/interested-user/interested-user.component";
import { PropertyComponent } from "../../../components/property/property.component";
import { sortTypes } from "../../../consts/DefaultTypes";
import { stringiFy } from "../../../consts/Utility";
import { PropertyModel } from "../../../models/PropertyModel";
import { LoadingService } from "../../../services/loading.service";
import { PropertyService } from "../../../services/property.service";
import { PropertyDetailComponent } from "../propertydetail/propertydetail.component";
import { SearchComponent } from "../search/search.component";

@Component({
	selector: "app-search-page",
	imports: [
		FormsModule,
		CommonModule,
		MatIconModule,
		SearchComponent,
		RouterModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
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
	pageEvent: PageEvent | undefined;
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
		private _interestedUserDialog: MatDialog,
		private route: ActivatedRoute,
		private propertyService: PropertyService,
		public loadingService: LoadingService,
		private titleService: Title,
		// private notificationService: NotificationService,
		// private storageService: StorageService,
		// private router: Router,
		// private activatedRoute: ActivatedRoute,
		private dialogService: DialogService
	) {
		this.titleService.setTitle("Search Properties");
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			if (Object.keys(params).length > 0) {
				debugger;
				this.selectedFilters = {
					...this.selectedFilters,
					...params,
				};
				this.searchProperties(this.selectedFilters);
			}
		});
	}

	openDialog(property: PropertyModel) {
		const userDialog = this._interestedUserDialog.open(InterestedUserComponent, {
			width: "50%",
			height: "auto",
			disableClose: true,
			autoFocus: false,
			restoreFocus: false,
			hasBackdrop: true,
			data: property,
		});

		userDialog.afterClosed().subscribe((result) => {
			if (result) {
				this.redirectToDetail(property);
			}
		});
	}

	selectProperty = (property: PropertyModel): void => {
		if (property.IsFeatureListing) {
			this.openDialog(property);
		} else {
			this.redirectToDetail(property);
		}
	};

	redirectToDetail(property: PropertyModel): void {
		this.dialogService.open(PropertyDetailComponent, {
			header: `Property Information`,
			width: "70%",
			maximizable: true,
			closable: true,
			modal: true,
			data: {
				propertyId: property._id,
				mlsId: property.ListingKey,
				city: property.City,
				town: property.Town,
				property_type: stringiFy(this.selectedFilters.property_type),
				property_subtype: stringiFy(this.selectedFilters.property_subtype),
			},
		});
	}

	sortChange(sort: any): void {
		this.selectedFilters.sort = sort;
		this.searchProperties(this.selectedFilters);
	}

	searchProperties = (selectedFilters: any, event?: PageEvent) => {
		debugger;
		this.pageIndex = event ? event.pageIndex + 1 : this.pageIndex;
		this.pageSize = event?.pageSize ?? this.pageSize;

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
