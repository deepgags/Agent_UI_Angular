
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CustomerModel } from '../../../models/CustomerModel';
import { StorageService } from '../../../services/storage.service';
import { FeaturedPropertiesComponent } from '../../shared/featured-properties/featured-properties.component';
import { SearchComponent } from '../../shared/search/search.component';

@Component({
	selector: 'app-t9-home',
	standalone: true,
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent],
	templateUrl: './t9-home.component.html',
	styleUrls: ['./t9-home.component.scss', '../t9.component.scss'],
	providers: [Title, StorageService]
})
export class T9HomeComponent implements OnInit {
	customer!: CustomerModel | null;

	constructor(private router: Router,
		private titleService: Title,
	) { }

	ngOnInit(): void {
		this.titleService.setTitle("Home")
	}

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;

		searchByMap = selectedFilters['searchByMap'] || searchByMap;
		this.router.navigate(['/t9', searchByMap ? 'map' : 'search'], {
			queryParams: {
				address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
			}
		});
	}
}
