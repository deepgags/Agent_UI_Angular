import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core"; // Added OnDestroy
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Title } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs";
import { InterestedUserComponent } from "../../../components/dialogs/interested-user/interested-user.component";
import { stringiFy } from "../../../consts/Utility";
import { PropertyModel } from "../../../models/PropertyModel";
import { SiteConfigService } from "../../../services/site-config.service";
// Import SiteConfigService
// import { RequestPropertyModel } from '../../../models/RequestPropertyModel'; // Not used in current snippet
// import { HighlightSearch } from '../../../pipes/highlight'; // Not used in current snippet
import { LoadingService } from "../../../services/loading.service";
import { PropertyService } from "../../../services/property.service";
// import { StorageService } from '../../../services/storage.service'; // Not used in current snippet
import { DialogService } from "primeng/dynamicdialog";
import { PropertyComponent } from "../../../components/property/property.component";
import { environment } from "../../../environments/environment.development";
import { SiteConfig } from "../../../models/SiteConfig";
import { PropertyDetailComponent } from "../propertydetail/propertydetail.component";
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
		PropertyComponent
	],
	templateUrl: "./featured-listings.component.html",
	styleUrl: "./featured-listings.component.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [DialogService],
})

export class FeaturedListingsComponent implements OnInit, OnDestroy {
	imageUrl = environment.imageUrl;
	propertiesList: PropertyModel[] | undefined;
	pageEvent: PageEvent | undefined;
	pageIndex: number = 1;
	pageSize: number = 12;
	private loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	private siteConfigSubscription: Subscription | undefined;
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
		private _interestedUserDialog: MatDialog,
		private propertyService: PropertyService,
		public loadingService: LoadingService,
		private titleService: Title,
		private siteConfigService: SiteConfigService,
		private dialogService: DialogService
	) {
		this.titleService.setTitle("Search Properties");
	}

	ngOnInit(): void {
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config: any) => {
			if (config) {
				this.siteId = config.id
			}
		});
		this.pageIndex = 1;
		this.pageSize = 12;
		this.searchProperties({});
	}

	ngOnDestroy(): void {
		if (this.siteConfigSubscription) {
			this.siteConfigSubscription.unsubscribe();
		}
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
	}

	redirectToDetail = (property: PropertyModel): void => {
		this.dialogService.open(PropertyDetailComponent, {
			header: `Property Information`,
			width: "70%",
			maximizable: true,
			closable: true,
			modal: true,
			data: {
				propertyId: property._id,
				mlsId: property.ListingKey,
				address: stringiFy(this.selectedFilters.address),
				property_type: stringiFy(this.selectedFilters.property_type),
				property_subtype: stringiFy(this.selectedFilters.property_subtype),
			},
		});
	}

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
			siteId: this.siteId
		};

		this.loadingService.loadingOn();
		this.loadingSubject.next(true);
		this.propertyService.featuredProperties(params).subscribe({
			next: (response) => {
				this.propertiesList = response;
			},
			error: (err) => {
			},
			complete: () => {
				this.loadingSubject.next(false);
			},
		});
		return event;
	};
}
