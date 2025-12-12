import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { BehaviorSubject } from "rxjs";
import { PropertyComponent } from "../../../components/property/property.component";
import { environment } from "../../../environments/environment.development";
import { PropertyModel } from "../../../models/PropertyModel";
import { PropertyService } from "../../../services/property.service";

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
	propertyImageUrl = environment.propertyImageUrl;
	private propertiesSubject = new BehaviorSubject<PropertyModel[]>([]);
	properties$ = this.propertiesSubject.asObservable();
	pageIndex: number = 1;
	pageSize: number = 8;

	constructor(private propertyService: PropertyService) {}

	ngOnInit(): void {
		this.searchProperties();
	}

	selectProperty = (property: PropertyModel): void => {
		this.propertyService.selectProperty(property, {});
	};

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
			city: "",
		};

		this.propertyService.featuredProperties(params).subscribe({
			next: (response) => {
				this.propertiesSubject.next(response);
			},
			error: (err) => {
				// this.notificationService.showNotification("Error occurred while getting properties");
			},
			complete: () => {},
		});
	};
}
