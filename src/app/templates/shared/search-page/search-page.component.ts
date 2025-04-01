import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyModel } from '../../../models/PropertyModel';
import { RequestPropertyModel } from '../../../models/RequestPropertyModel';
import { PropertyService } from '../../../services/property.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule, SearchComponent, RouterModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchPageComponent {
  properties: PropertyModel[] = [];
  page = 1;
  selectedFilters: any = {};
  templateClass: string = '';
  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.selectedFilters = params;
        this.searchProperties(params);
      }
    });
  }

  searchProperties = (selectedFilters: any) => {
    const { location, propertyType, storyType, beds, baths, minPrice, maxPrice,propertyStatus, sqFt } = selectedFilters;
    const params: RequestPropertyModel = {
      page: this.page,
      page_size: 20,
      address: location,
      property_type: propertyType,
      property_subtype: storyType,
      bedrooms: baths,
      bathrooms: beds,
      property_for: propertyStatus,
      min_price: minPrice,
      max_price: maxPrice,
      min_area: sqFt,
    }
    this.propertyService.searchProperties(params).then((properties) => {
      console.log(properties);
      this.properties = properties
    }).catch((error) => {
      console.error('Error fetching properties:', error);
    });
  }
}
