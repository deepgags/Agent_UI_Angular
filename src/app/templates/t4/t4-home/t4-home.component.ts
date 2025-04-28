import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchComponent } from '../../shared/search/search.component';
import { Title } from '@angular/platform-browser';
import { FeaturedPropertiesComponent } from '../../shared/featured-properties/featured-properties.component';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';

@Component({
  selector: 'app-t4-home',
  imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent],
  templateUrl: './t4-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./t4-home.component.scss','../t4.component.scss']
})
export class T4HomeComponent implements OnInit {
  customer: CustomerModel | undefined;

  constructor(private router: Router,
    private titleService : Title,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Home")
    this.customer = this.storageService.getLoggedUserFromUserInfo();
  }
  
  searchProperties = (selectedFilters: any, searchByMap:boolean = false) => {
    const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
    searchByMap = selectedFilters['searchByMap'] || searchByMap;
    this.router.navigate(['/t4', searchByMap ? 'map' :'search'], {
      queryParams: {
        address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
      }
    });
  }
}
