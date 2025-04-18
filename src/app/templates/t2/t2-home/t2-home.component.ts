import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchComponent } from '../../shared/search/search.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-t2-home',
  imports: [RouterModule, SearchComponent],
  templateUrl: './t2-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./t2-home.component.scss','../t2.component.scss']
})
export class T2HomeComponent implements OnInit {
  constructor(private router: Router,
    private titleService : Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Home")
  }
  
  searchProperties = (selectedFilters: any, searchByMap:boolean = false) => {
    const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
    this.router.navigate(['/t2', !searchByMap ? 'map' :'search'], {
      queryParams: {
        address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
      }
    });
  }
}
