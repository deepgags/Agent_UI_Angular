import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { BehaviorSubject } from "rxjs";
import { InterestedUserComponent } from "../../../components/dialogs/interested-user/interested-user.component";
import { PropertyComponent } from "../../../components/property/property.component";
import { environment } from "../../../environments/environment.development";
import { PropertyModel } from "../../../models/PropertyModel";
import { PropertyService } from "../../../services/property.service";
import { PropertyDetailComponent } from "../propertydetail/propertydetail.component";

@Component({
	selector: "app-featured-properties",
	imports: [FormsModule, CommonModule, MatIconModule, RouterModule, PropertyComponent],
	templateUrl: "./featured-properties.component.html",
	styleUrl: "./featured-properties.component.scss",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [DialogService],
})

export class FeaturedPropertiesComponent implements OnInit {
	imageUrl = environment.imageUrl;
	private propertiesSubject = new BehaviorSubject<PropertyModel[]>([]);
	properties$ = this.propertiesSubject.asObservable();
	pageIndex: number = 1;
	pageSize: number = 6;

	constructor(
		private _interestedUserDialog: MatDialog,
		private propertyService: PropertyService,
		private dialogService: DialogService
	) { }

	ngOnInit(): void {
		this.searchProperties();
	}

	selectProperty = (property: PropertyModel): void => {
		if (property.IsFeatureListing) {
			this.openDialog(property);
		} else {
			this.redirectToDetail(property);
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

	redirectToDetail(property: PropertyModel): void {
		// const currentTemplate = this.router.url.split("/")[1];
		// this.router.navigate([`/${currentTemplate}`, "property-detail"], {
		// 	relativeTo: this.activatedRoute,
		// 	queryParams: {
		// 		address: "",
		// 		property_type: "",
		// 		bedrooms: "",
		// 		bathrooms: "",
		// 		min_price: "",
		// 		max_price: "",
		// 		property_status: "",
		// 		sqFt: "",
		// 		propertyId: property._id,
		// 		mlsId: property.ListingKey,
		// 	},
		// 	queryParamsHandling: "replace",
		// });
		this.dialogService.open(PropertyDetailComponent, {
			header: `Property Information`,
			width: "70%",
			maximizable: true,
			closable: true,
			modal: true,
			data: {
				propertyId: property._id,
				mlsId: property.ListingKey,
			},
		});
	}

	searchProperties = () => {
		const userInfo: any = {};

		const params = {
			page: this.pageIndex,
			pageSize: this.pageSize,
			address: "",
			property_type: "",
			property_subtype: "",
			bedrooms: "",
			bathrooms: "",
			property_for: "",
			min_price: "",
			max_price: "",
			sqFt: "",
			distance: "",
			brokerageType: userInfo?.brokerage?.alternateName,
			// propertyFeedType: "IDX",
			sort: "",
		};

		this.propertyService.featuredProperties(params).subscribe({
			next: (response) => {
				this.propertiesSubject.next(response);
			},
			error: (err) => {
				// this.notificationService.showNotification("Error occurred while getting properties");
			},
			complete: () => { },
		});
	};
}
