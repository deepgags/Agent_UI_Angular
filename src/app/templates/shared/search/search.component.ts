import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bathTypes, bedTypes, maxPrices, minPrices, propertyTypes, sqFitTypes, statusTypes, storyTypes } from '../../../consts/DefaultTypes';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class SearchComponent {
  @Input('onSearch') onSearch: Function = () => { };
  @Input('filters') filters:any = {
    location: '',
    propertyType: '',
    storyType: '',
    beds: '0',
    baths: '0',
    minPrice: '',
    maxPrice: '',
    propertyStatus: '',
    sqFt: '0',
  };

  propertyTypesDropDown = propertyTypes;
  storyTypesDropDown = storyTypes;
  bedTypesDropDown = bedTypes;
  bathTypesDropDown = bathTypes;
  statusTypesDropDown = statusTypes;
  minPricesDropDown = minPrices;
  maxPricesDropDown = maxPrices;
  sqFtTypesDropDown = sqFitTypes;

  // selectedFilters = {
  //   location: '',
  //   propertyType: '',
  //   storyType: '',
  //   beds: '0',
  //   baths: '0',
  //   minPrice: '',
  //   maxPrice: '',
  //   propertyStatus: '',
  //   sqFt: '0',
  // }

  searchProperties = () => {
    this.onSearch(this.filters);
  }
}
