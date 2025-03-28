
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchComponent } from '../../shared/search/search.component';

@Component({
  selector: 'app-t1-home',
  imports: [RouterModule, SearchComponent],
  templateUrl: './t1-home.component.html',
  styleUrls: ['./t1-home.component.scss', '../t1.component.scss']
})
export class T1HomeComponent {

  constructor(private router: Router) { }

  searchProperties = (selectedFilters: any) => {
    const { location, propertyType, storyType, beds, baths, minPrice, maxPrice, propertyStatus, sqFt } = selectedFilters;
    this.router.navigate(['/t1', 'search'], {
      queryParams: {
        location, propertyType, storyType, beds, baths, minPrice, maxPrice, propertyStatus, sqFt
      }
    });
  }
}
