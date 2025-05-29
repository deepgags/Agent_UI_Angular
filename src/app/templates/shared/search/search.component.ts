import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";
import { ActivatedRoute, Router } from "@angular/router";
import {
	bathTypes,
	bedTypes,
	maxPrices,
	minPrices,
	propertyTypes,
	sqFitTypes,
	statusTypes,
	storyTypes,
} from "../../../consts/DefaultTypes";
import { StorageService } from "../../../services/storage.service";

@Component({
	selector: "app-search",
	imports: [FormsModule, CommonModule, MatSliderModule],
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
})
export class SearchComponent implements OnInit {
	@Input("onSearch") onSearch: Function = () => {};

	@Input("showMapSearch") showMapSearch = true;

	@Input("filters") filters: any = {
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

	propertyTypesDropDown = propertyTypes;
	storyTypesDropDown = storyTypes;
	bedTypesDropDown = bedTypes;
	bathTypesDropDown = bathTypes;
	statusTypesDropDown = statusTypes;
	minPricesDropDown = minPrices;
	maxPricesDropDown = maxPrices;
	sqFtTypesDropDown = sqFitTypes;

	constructor(private router: Router, private activatedRoute: ActivatedRoute, private storageService: StorageService) {}

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
			this.router.navigate([`${currentUrl}/map`], {
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

	ngOnInit(): void {}

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
}
