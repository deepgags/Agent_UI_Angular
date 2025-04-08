
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchComponent } from '../../shared/search/search.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-t1-home',
  imports: [RouterModule, SearchComponent],
  templateUrl: './t1-home.component.html',
  styleUrls: ['./t1-home.component.scss','../t1.component.scss']
})
export class T1HomeComponent implements OnInit  {

  constructor(private router: Router,
    private titleService : Title   
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Home")
  }

  searchProperties = (selectedFilters: any) => {
    const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
    this.router.navigate(['/t1', 'search'], {
      queryParams: {
        address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
      }
    });
  }
}
