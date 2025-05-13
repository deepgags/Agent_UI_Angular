import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { url } from 'inspector';
import { bathTypes, bedTypes, maxPrices, minPrices, propertyTypes, sqFitTypes, statusTypes, storyTypes } from '../../../consts/DefaultTypes';
import { stringiFy } from '../../../consts/Utility';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-search',
	imports: [FormsModule, CommonModule, MatSliderModule],
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: true
})
export class SearchComponent implements OnInit {

	@Input('onSearch') onSearch: Function = () => { };

	@Input('showMapSearch') showMapSearch = true;

	@Input('filters') filters: any = {
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

	propertyTypesDropDown = propertyTypes;
	storyTypesDropDown = storyTypes;
	bedTypesDropDown = bedTypes;
	bathTypesDropDown = bathTypes;
	statusTypesDropDown = statusTypes;
	minPricesDropDown = minPrices;
	maxPricesDropDown = maxPrices;
	sqFtTypesDropDown = sqFitTypes;

	constructor(private router: Router,
		private activatedRoute: ActivatedRoute,
		private storageService: StorageService,) {
	}

	searchProperties = (searchByMap: boolean = false) => {
		const filtersWithValue = Object.fromEntries(
			Object.entries(this.filters)
				.map((x) => { return stringiFy(x) })
		);

		filtersWithValue["searchByMap"] = searchByMap;
		const filters =
		{
			address: filtersWithValue['address'],
			property_type: filtersWithValue['property_type'],
			bedrooms: filtersWithValue['bedrooms'],
			bathrooms: filtersWithValue['bathrooms'],
			min_price: filtersWithValue['min_price'],
			max_price: filtersWithValue['max_price'],
			property_status: filtersWithValue['property_status'],
			sqFt: filtersWithValue['sqFt'],
			distance: filtersWithValue['distance']
		}

		if (searchByMap) {
			const userInfo = this.storageService.getLoggedUserFromUserInfo();
			let navigationUrl;
			//   switch (userInfo.templateId) {
			//     case '0b69c6031f111d63bc2c975dd2837e38':
			//       navigationUrl = "t1/map";
			//       break;
			//     case '0b69c6031f111d63bc2c975dd2837e39':
			//     navigationUrl = "t2/map";
			//       break;
			//     case '0b69c6031f111d63bc2c975dd2837e40':
			//       navigationUrl = "t3/map";
			//       break;
			//     case "0b69c6031f111d63bc2c975dd2837e41":
			//       navigationUrl = "t4/map";
			//       break;
			//   }
			this.router.navigate(
				[navigationUrl],
				{
					queryParams: filters,
					queryParamsHandling: 'replace'
				}
			);
		}
		else {
			this.router.navigate(
				[],
				{
					relativeTo: this.activatedRoute,
					queryParams: filters,
					queryParamsHandling: 'replace'
				}
			);
			this.onSearch(filtersWithValue);
		}
	}

	ngOnInit(): void {
	}

	resetFilters(): void {
		this.filters = {
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
	}

	resetMoreFilters(): void {
		this.filters = {
			address: this.filters.address,
			property_type: this.filters.property_type,
			bedrooms: this.filters.bedrooms,
			bathrooms: this.filters.bathrooms,
			min_price: '',
			max_price: '',
			property_status: this.filters.property_status,
			sqFt: '',
			distance: '20',
		};
	}

	formatLabel(value: number): string {
		if (value >= 1000) {
			return Math.round(value / 1000) + 'mile';
		}

		return `${value}`;
	}
}
