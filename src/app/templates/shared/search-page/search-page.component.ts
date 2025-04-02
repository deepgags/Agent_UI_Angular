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
  selectedFilters: any = {
    location: '',
    propertyType: '',
    storyType: '',
    beds: '0',
    baths: '0',
    minPrice: '',
    maxPrice: '',
    propertyStatus: '',
    sqFt: '',
  };
  templateClass: string = '';
  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.selectedFilters = {
          ...this.selectedFilters,
          ...params
        };
        this.searchProperties(params);
      }
    });
  }

  searchProperties = (selectedFilters: any) => {
    const { location, propertyType, storyType, beds, baths, minPrice, maxPrice, propertyStatus, sqFt } = selectedFilters;
    const params: RequestPropertyModel = {
      page: this.page,
      page_size: 20,
    }

    if (location) {
      params.address = location;
    }

    if (propertyType) {
      params.property_type = propertyType;
    }

    if (storyType) {
      params.property_subtype = storyType;
    }

    if (beds && beds !== '0') {
      params.bedrooms = beds;
    }

    if (baths && baths !== '0') {
      params.bathrooms = baths;
    }

    if (propertyStatus) {
      params.property_for = propertyStatus;
    }

    if (minPrice) {
      params.min_price = minPrice;
    }

    if (maxPrice) {
      params.max_price = maxPrice;
    }

    if (sqFt && sqFt !== '0') {
      params.min_area = sqFt;
    }
    this.propertyService.searchProperties(params).subscribe({
      next: ({data, message, status}) => {
        if (status) {
          this.properties = data;
        } else {
          this.properties = [];
        }
      },
      error: (error) => {
        console.error('Error fetching properties:', error);
      }
    })
  }
}
