import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CustomerModel } from '../../../models/CustomerModel';
import { StorageService } from '../../../services/storage.service';
import { FeaturedPropertiesComponent } from '../../shared/featured-properties/featured-properties.component';
import { SearchComponent } from '../../shared/search/search.component';

@Component({
	selector: 'app-t3-home',
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent],
	templateUrl: './t3-home.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./t3-home.component.scss', '../t3.component.scss']
})
export class T3HomeComponent implements OnInit {
	customer: CustomerModel | undefined;

	constructor(private router: Router,
		private titleService: Title,
		private storageService: StorageService
	) {

	}

	ngOnInit(): void {
		this.titleService.setTitle("Home")
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;

		searchByMap = selectedFilters['searchByMap'] || searchByMap;
		this.router.navigate(['/t3', searchByMap ? 'map' : 'search'], {
			queryParams: {
				address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
			}
		});
	}
}
