import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchComponent } from '../../shared/search/search.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-t2-home',
  imports: [RouterModule, SearchComponent],
  templateUrl: './t2-home.component.html',
  styleUrls: ['./t2-home.component.scss']
})
export class T2HomeComponent implements OnInit {
  constructor(private router: Router,
    private titleService : Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Home")
  }
  
  searchProperties = (selectedFilters: any) => {
    const { location, propertyType, storyType, beds, baths, minPrice, maxPrice, propertyStatus, sqFt } = selectedFilters;
    this.router.navigate(['/t2', 'search'], {
      queryParams: {
        location, propertyType, storyType, beds, baths, minPrice, maxPrice, propertyStatus, sqFt
      }
    });
  }
}
