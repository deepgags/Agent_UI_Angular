import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bathTypes, bedTypes, maxPrices, minPrices, propertyTypes, sqFitTypes, statusTypes, storyTypes } from '../../../consts/DefaultTypes';
import { stringiFy } from '../../../consts/Utility';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class SearchComponent implements OnInit {
  
  @Input('onSearch') onSearch: Function = () => { };

  @Input('filters') filters:any = {
    address: '',
    property_type: '',
    bedrooms: '0',
    bathrooms: '0',
    min_price: '',
    max_price: '',
    property_status: '',
    sqFt: '',
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
    private activatedRoute: ActivatedRoute,) {
  }

  searchProperties = () => {
    const filtersWithValue = Object.fromEntries(
      Object.entries(this.filters)
        .map((x)=>{ return stringiFy(x) })
    );
    
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          address: filtersWithValue['address'], 
          property_type: filtersWithValue['property_type'],
          bedrooms: filtersWithValue['bedrooms'],
          bathrooms: filtersWithValue['bathrooms'], 
          min_price: filtersWithValue['min_price'], 
          max_price: filtersWithValue['max_price'], 
          property_status: filtersWithValue['property_status'], 
          sqFt: filtersWithValue['sqFt']
        },
        queryParamsHandling: 'replace'
      }
    );
    this.onSearch(filtersWithValue);
  }

  ngOnInit(): void {
  }

  resetFilters() : void {
    this.filters = {
      address: '',
      property_type: '',
      bedrooms: '0',
      bathrooms: '0',
      min_price: '',
      max_price: '',
      property_status: '',
      sqFt: '',
    };
  }
}
