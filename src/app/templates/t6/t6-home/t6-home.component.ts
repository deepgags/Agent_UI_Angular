import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchComponent } from '../../shared/search/search.component';
import { Title } from '@angular/platform-browser';
import { FeaturedPropertiesComponent } from '../../shared/featured-properties/featured-properties.component';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PhoneSearch } from '../../../Pipes/phoneSearch';


@Component({
  selector: 'app-t6-home',
  imports: [RouterModule, SearchComponent,PhoneSearch, FeaturedPropertiesComponent, CommonModule, NgbModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './t6-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./t6-home.component.scss','../t6.component.scss']
})
export class T6HomeComponent implements OnInit {
  customer: CustomerModel | undefined;
  userForm!: FormGroup;

  constructor(private router: Router,
    private fb: FormBuilder,
    private titleService : Title,
    private storageService: StorageService
  ) { }
  
  ngOnInit(): void {
    this.titleService.setTitle("Home")
    this.customer = this.storageService.getLoggedUserFromUserInfo();
    
   this.userForm = this.fb.group({
    firstName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    comment: new FormControl('', Validators.required),
  });
  }
  
  searchProperties = (selectedFilters: any, searchByMap:boolean = false) => {
    const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
    searchByMap = selectedFilters['searchByMap'] || searchByMap;
    this.router.navigate(['/t6', searchByMap ? 'map' :'search'], {
      queryParams: {
        address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
      }
    });
  }
}
