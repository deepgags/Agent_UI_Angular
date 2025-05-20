import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { InteresteduserComponent } from '../../../components/dialogs/interested-user/interested-user.component';
import { stringiFy } from '../../../consts/Utility';
import { PropertyModel } from '../../../models/PropertyModel';
import { NotificationService } from '../../../services/notification.service';
import { PropertyService } from '../../../services/property.service';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-featured-properties',
	imports: [FormsModule, CommonModule, MatIconModule, RouterModule],
	templateUrl: './featured-properties.component.html',
	styleUrl: './featured-properties.component.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})

export class FeaturedPropertiesComponent implements OnInit {
	// properties: PropertyModel[] | undefined;
	private propertiesSubject = new BehaviorSubject<PropertyModel[]>([]);
	properties$ = this.propertiesSubject.asObservable();
	pageIndex: number = 1;
	pageSize: number = 6;

	constructor(
		private _interestedUserDialog: MatDialog,
		private propertyService: PropertyService,
		private notificationService: NotificationService,
		private storageService: StorageService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit(): void {
		this.searchProperties();
	}

	selectProperty(property: PropertyModel): void {
		if (property.IsFeatureListing) {
			this.openDialog(property);
		}
		else {
			this.redirectToDetail(property);
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

	redirectToDetail(property: PropertyModel): void {
		const propertyUrl = "" //userInfo.templateId == "0b69c6031f111d63bc2c975dd2837e38" ? '/t1/propertydetail' : '/t2/propertydetail';
		this.router.navigate(
			[propertyUrl],
			{
				relativeTo: this.activatedRoute,
				queryParams: {
					address: '',
					property_type: '',
					bedrooms: '',
					bathrooms: '',
					min_price: '',
					max_price: '',
					property_status: '',
					sqFt: '',
					propertyId: property._id,
					mlsId: property.ListingKey
				},
				queryParamsHandling: 'replace'
			}
		);
	}

	searchProperties = () => {
		const userInfo: any = {};

		const params = {
			page: this.pageIndex,
			pageSize: this.pageSize,
			address: '',
			property_type: '',
			property_subtype: '',
			bedrooms: '',
			bathrooms: '',
			property_for: '',
			min_price: '',
			max_price: '',
			sqFt: '',
			distance: '',
			brokerageType: userInfo?.brokerage?.alternateName,
			propertyFeedType: 'IDX'
		}

		this.propertyService.searchProperties(params).subscribe({
			next: (response) => {
				this.propertiesSubject.next(response);
			},
			error: (err) => {
				this.notificationService.showNotification("Error occurred while getting properties");
			},
			complete: () => {
			}
		})
	}
}
