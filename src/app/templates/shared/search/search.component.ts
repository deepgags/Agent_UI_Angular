import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bathTypes, bedTypes, maxPrices, minPrices, propertyTypes, sqFitTypes, statusTypes, storyTypes } from '../../../consts/DefaultTypes';
import { stringiFy } from '../../../consts/Utility';

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
    // storyType: '',
    bedrooms: '0',
    bathrooms: '0',
    min_price: '',
    max_price: '',
    property_status: '',
    min_area: '',
  };

  propertyTypesDropDown = propertyTypes;
  storyTypesDropDown = storyTypes;
  bedTypesDropDown = bedTypes;
  bathTypesDropDown = bathTypes;
  statusTypesDropDown = statusTypes;
  minPricesDropDown = minPrices;
  maxPricesDropDown = maxPrices;
  sqFtTypesDropDown = sqFitTypes;

  searchProperties = () => {
    const filtersWithValue = Object.fromEntries(
      Object.entries(this.filters)
        .map((x)=>{return stringiFy(x)})
    );
    this.onSearch(filtersWithValue);
  }

  ngOnInit(): void {
  }
}
