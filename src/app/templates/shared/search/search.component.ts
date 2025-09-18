
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";
import { ActivatedRoute, Router } from "@angular/router";
import {
	bathTypes,
	bedTypes,
	maxPrices,
	minPrices,
	propertySubTypes,
	propertyTypes,
	sqFitTypes,
	statusTypes,
	storyTypes,
} from "../../../consts/DefaultTypes";
import { LoadingService } from "../../../services/loading.service";
import { PropertyService } from "../../../services/property.service";

@Component({
	selector: "app-search",
	imports: [FormsModule, MatSliderModule],
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
})
export class SearchComponent implements OnInit {
	@Input("onSearch") onSearch: Function = () => { };

	@Input("showMapSearch") showMapSearch = true;

	@Input("filters") filters: any = {
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
	};

	propertyTypesDropDown: any = [];
	propertySubTypesDropDown: any = [];
	private _allPropertySubTypes: any = [];
	storyTypesDropDown = storyTypes;
	bedTypesDropDown = bedTypes;
	bathTypesDropDown = bathTypes;
	statusTypesDropDown = statusTypes;
	minPricesDropDown = minPrices;
	maxPricesDropDown = maxPrices;
	sqFtTypesDropDown = sqFitTypes;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private propertyService: PropertyService,
		public loadingService: LoadingService
	) { }

	searchProperties = (searchByMap: boolean = false) => {
		const currentUrl = this.router.url.split("/")[1];
		const filtersWithValue = Object.fromEntries(
			Object.entries(this.filters)
				.filter(([key, value]) => value !== "" && value !== null && value !== undefined)
				.map((entry) => {
					return entry;
				})
		);

		filtersWithValue["searchByMap"] = searchByMap;
		// const filters = {
		// 	address: filtersWithValue['address'],
		// 	property_type: filtersWithValue['property_type'],
		// 	bedrooms: filtersWithValue['bedrooms'],
		// 	bathrooms: filtersWithValue['bathrooms'],
		// 	min_price: filtersWithValue['min_price'],
		// 	max_price: filtersWithValue['max_price'],
		// 	property_status: filtersWithValue['property_status'],
		// 	sqFt: filtersWithValue['sqFt'],
		// 	distance: filtersWithValue['distance']
		// }

		if (searchByMap) {
			this.router.navigate(['/map'], {
				queryParams: filtersWithValue,
				queryParamsHandling: "replace",
			});
		} else {
			this.router.navigate([], {
				relativeTo: this.activatedRoute,
				queryParams: filtersWithValue,
				queryParamsHandling: "replace",
			});
			this.onSearch(filtersWithValue);
		}
	};

	ngOnInit(): void {
		this.getPropertyTypeDropdowns();
	}

	resetFilters(): void {
		this.filters = {
			address: "",
			property_type: "",
			bedrooms: "0",
			bathrooms: "0",
			min_price: "",
			max_price: "",
			property_status: "",
			sqFt: "",
			distance: "20",
		};
	}

	resetMoreFilters(): void {
		this.filters = {
			address: this.filters.address,
			property_type: this.filters.property_type,
			bedrooms: this.filters.bedrooms,
			bathrooms: this.filters.bathrooms,
			min_price: "",
			max_price: "",
			property_status: this.filters.property_status,
			sqFt: "",
			distance: "20",
		};
	}

	formatLabel(value: number): string {
		if (value >= 1000) {
			return Math.round(value / 1000) + "mile";
		}

		return `${value}`;
	}

	getPropertyTypeDropdowns() {
		this.propertyService.getPropertyTypes().subscribe({
			next: (response) => {
				this.propertyTypesDropDown = response.propertyTypes;
				this._allPropertySubTypes = response.propertySubTypes;
				this.filters.property_type = response.propertyTypes[0].LookupValue;
				this.filterPropertySubType()
			},
			error: (err) => { },
			complete: () => { },
		});
	}

	filterPropertySubType() {
		for (const propertyType of this.propertyTypesDropDown) {
			if (propertyType.LookupValue == this.filters.property_type) {
				this.propertySubTypesDropDown = this._allPropertySubTypes.filter((_subType: any) => _subType.parent == propertyType._id);
				this.filters.property_subtype = this.propertySubTypesDropDown[0].LookupValue
				break;
			}
		}
	}
}
