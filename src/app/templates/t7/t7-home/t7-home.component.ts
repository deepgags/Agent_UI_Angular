import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { StorageService } from '../../../services/storage.service';
import { FeaturedPropertiesComponent } from '../../shared/featured-properties/featured-properties.component';
import { SearchComponent } from '../../shared/search/search.component';


@Component({
	selector: 'app-t7-home',
	imports: [RouterModule, SearchComponent, PhoneSearch, FeaturedPropertiesComponent, CommonModule, NgbModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
	templateUrl: './t7-home.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./t7-home.component.scss', '../t7.component.scss']
})
export class T7HomeComponent implements OnInit {
	customer?: CustomerModel | null;
	userForm!: FormGroup;

	constructor(private router: Router,
		private fb: FormBuilder,
		private titleService: Title,
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

	searchProperties = (selectedFilters: any, searchByMap: boolean = false) => {
		const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
		searchByMap = selectedFilters['searchByMap'] || searchByMap;
		this.router.navigate(['/t7', searchByMap ? 'map' : 'search'], {
			queryParams: {
				address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
			}
		});
	}
}
