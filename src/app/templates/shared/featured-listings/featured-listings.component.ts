import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'; // Added OnDestroy
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs'; // Added Subscription
import { InteresteduserComponent } from '../../../components/dialogs/interested-user/interested-user.component';
import { stringiFy } from '../../../consts/Utility';
import { PropertyModel } from '../../../models/PropertyModel';
import { SiteConfigService } from '../../../services/site-config.service'; // Import SiteConfigService
// import { RequestPropertyModel } from '../../../models/RequestPropertyModel'; // Not used in current snippet
// import { HighlightSearch } from '../../../pipes/highlight'; // Not used in current snippet
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';
import { PropertyService } from '../../../services/property.service';
// import { StorageService } from '../../../services/storage.service'; // Not used in current snippet
import { SearchComponent } from '../search/search.component';

@Component({
	selector: 'app-featured-listings',
	imports: [FormsModule, CommonModule, MatIconModule, SearchComponent, RouterModule, MatPaginatorModule, MatProgressSpinnerModule],
	templateUrl: './featured-listings.component.html',
	styleUrl: './featured-listings.component.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class FeaturedListingsComponent implements OnInit, OnDestroy {
	propertiesList: PropertyModel[] | undefined;
	pageEvent: PageEvent | undefined;
	pageIndex: number = 1;
	pageSize: number = 12;
	private loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	private siteConfigSubscription: Subscription | undefined;
	private currentTemplateId: string | null = null;

	selectedFilters: any = {
		address: '',
		property_type: '',
		bedrooms: '0',
		bathrooms: '0',
		min_price: '',
		max_price: '',
		property_status: '',
		sqFt: '',
		distance: '20',
	};

	constructor(
		private _interestedUserDialog: MatDialog,
		// private route: ActivatedRoute, // Replaced by activatedRoute
		private propertyService: PropertyService,
		public loadingService: LoadingService,
		private notificationService: NotificationService,
		// private storageService: StorageService, // Not directly used in snippet
		private titleService: Title,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private siteConfigService: SiteConfigService // Inject SiteConfigService
	) {
		this.titleService.setTitle("Search Properties");
	}

	ngOnInit(): void {
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe(config => {
			if (config && config.templateId) {
				this.currentTemplateId = config.templateId;
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
		const userDialog = this._interestedUserDialog.open(InteresteduserComponent,
			{
				width: '50%',
				height: 'auto',
				disableClose: true,
				autoFocus: false,
				restoreFocus: false,
				hasBackdrop: true,
				data: property
			}
		)

		userDialog.afterClosed().subscribe(result => {
			if (result) {
				this.redirectToDetail(property);
			}
		});
	}

	selectProperty(property: PropertyModel): void {
		if (property.IsFeatureListing) { // Assuming IsFeatureListing is a boolean property
			this.openDialog(property);
		}
		else {
			this.redirectToDetail(property);
		}
	}

	redirectToDetail(property: PropertyModel): void {
		if (!this.currentTemplateId) {
			console.error("Template ID not available to redirect to property detail.");
			this.notificationService.showNotification("Cannot determine page context. Please try again.");
			return;
		}

		const propertyDetailPath = `/${this.currentTemplateId}/propertydetail`;

		this.router.navigate(
			[propertyDetailPath], // Use the fully constructed path from root
			{
				// relativeTo: this.activatedRoute, // Not needed if path is absolute from root
				queryParams: {
					address: this.selectedFilters['address'],
					property_type: this.selectedFilters['property_type'],
					bedrooms: this.selectedFilters['bedrooms'],
					bathrooms: this.selectedFilters['bathrooms'],
					min_price: this.selectedFilters['min_price'],
					max_price: this.selectedFilters['max_price'],
					property_status: this.selectedFilters['property_status'],
					sqFt: this.selectedFilters['sqFt'],
					propertyId: property._id,
					mlsId: property.ListingKey
				},
				queryParamsHandling: 'merge' // Consider 'merge' or 'preserve' based on desired behavior
			}
		);
	}

	searchProperties = (selectedFilters: any, event?: PageEvent) => {
		this.pageIndex = event ? event.pageIndex + 1 : this.pageIndex;
		this.pageSize = event?.pageSize ?? this.pageSize;

		const userInfo: any = {};

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
			brokerageType: userInfo?.brokerage?.alternateName,
			propertyFeedType: 'IDX'
		}

		this.loadingService.loadingOn();
		this.loadingSubject.next(true);
		this.propertyService.searchProperties(params).subscribe({
			next: (response) => {
				this.propertiesList = response;
			},
			error: (err) => {
				this.notificationService.showNotification("Error occurred while getting properties");
			},
			complete: () => {
				this.loadingSubject.next(false);
			}
		})
		return event;
	}
}
