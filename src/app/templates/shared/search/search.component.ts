import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AutoCompleteCompleteEvent, AutoCompleteModule } from "primeng/autocomplete";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { SelectModule } from "primeng/select";
import {
	bathTypes,
	bedTypes,
	maxPrices,
	minPrices,
	sqFitTypes,
	statusTypes,
	storyTypes,
} from "../../../consts/DefaultTypes";
import { LoadingService } from "../../../services/loading.service";
import { PropertyService } from "../../../services/property.service";

import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { environment } from "../../../environments/environment.development";
@Component({
	selector: "app-search",
	imports: [
		FormsModule,
		AutoCompleteModule,
		SelectModule,
		InputNumberModule,
		DialogModule,
		InputGroupModule,
		InputGroupAddonModule,
	],
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
})
export class SearchComponent implements OnInit {
	propertyImageUrl = environment.propertyImageUrl;
	@Input("onSearch") onSearch: Function = () => {};

	@Input("showMapSearch") showMapSearch = true;

	_filtersDefault: any = {
		searchUsing: "ADDRESS",
		address: "",
		property_type: "",
		property_subtype: "",
		bedrooms: "0",
		bathrooms: "0",
		min_price: 0,
		max_price: "",
		property_status: "",
		sqFt: "",
		distance: "20",
	};

	@Input("filters") filters: any = { ...this._filtersDefault };

	// private _cities: any = [];
	// cities: any = [];
	propertiesSuggestions: any = [];
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

	showFilterDialog: boolean = false;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private propertyService: PropertyService,
		public loadingService: LoadingService,
		private cdr: ChangeDetectorRef
	) {}

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
				// this._cities = response.cities;
				this.propertyTypesDropDown = response.propertyTypes;
				this._allPropertySubTypes = response.propertySubTypes;
				// this.filters.property_type = response.propertyTypes[0].LookupValue;
				this.filterPropertySubType();
				setTimeout(() => {
					this.setFiltersFromQueryParams();
				}, 200);
			},
			error: (err) => {},
			complete: () => {},
		});
	}

	filterPropertySubType() {
		for (const propertyType of this.propertyTypesDropDown) {
			if (propertyType.LookupValue == this.filters.property_type) {
				const _subTypeDropDown = this._allPropertySubTypes.filter(
					(_subType: any) => _subType.parent == propertyType._id
				);
				this.propertySubTypesDropDown = [{ LookupValue: "All", _id: "" }, ..._subTypeDropDown];
				this.filters.property_subtype = this.propertySubTypesDropDown[0].LookupValue;
				break;
			}
		}
	}

	searchCityProvince(event: AutoCompleteCompleteEvent) {
		// this.propertiesSuggestions = [];
		// this.cities = this._cities.filter((item: any) =>
		// 	// item.province_name?.toLowerCase().startsWith(event.query.toLowerCase()) ||
		// 	item.city?.toLowerCase().startsWith(event.query.toLowerCase())
		// );
		if (event.query && event.query.length > 3) {
			this.propertyService.findPropertyFromMlsOrAddress(event.query.toLowerCase()).subscribe({
				next: (res) => {
					this.propertiesSuggestions = res.data;
					this.cdr.detectChanges();
				},
				error: (err) => {},
				complete: () => {},
			});
		}
	}

	setFiltersFromQueryParams = () => {
		this.activatedRoute.queryParams.subscribe((params: any) => {
			const { bathrooms, bedrooms, property_subtype, property_type } = params;
			if (property_type) {
				this.filters.property_type = property_type;
				this.filterPropertySubType();
			}
			if (property_subtype) {
				this.filters.property_subtype = property_subtype;
			}

			if (bathrooms) {
				this.filters.bathrooms = bathrooms;
			}
			if (bedrooms) {
				this.filters.bedrooms = bedrooms;
			}
		});
	};

	searchProperties = (searchByMap: boolean = false) => {
		this.closeFilterDialog();
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
			this.router.navigate(["/map"], {
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

	openFilterDialog() {
		this.showFilterDialog = true;
	}

	closeFilterDialog() {
		this.showFilterDialog = false;
	}

	onSuggestionSelect() {
		this.searchProperties();
	}
}
