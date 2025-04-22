import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bathTypes, bedTypes, maxPrices, minPrices, propertyTypes, sqFitTypes, statusTypes, storyTypes } from '../../../consts/DefaultTypes';
import { stringiFy } from '../../../consts/Utility';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';

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

  @Input('filters') filters:any = {
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
    private activatedRoute: ActivatedRoute,) {
  }

  searchProperties = (searchByMap:boolean = false) => {
    const filtersWithValue = Object.fromEntries(
      Object.entries(this.filters)
        .map((x)=>{ return stringiFy(x) })
    );
    
    filtersWithValue["searchByMap"] = searchByMap;

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
          sqFt: filtersWithValue['sqFt'],
          distance: filtersWithValue['distance']
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
      distance: '20',
    };
  }

  resetMoreFilters() : void {
    this.filters = {
      address: this.filters.address,
      property_type: this.filters.property_type,
      bedrooms: this.filters.bedrooms,
      bathrooms: this.filters.bathrooms,
      min_price: this.filters.min_price,
      max_price: this.filters.max_price,
      property_status: this.filters.property_status,
      sqFt: this.filters.sqFt,
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
