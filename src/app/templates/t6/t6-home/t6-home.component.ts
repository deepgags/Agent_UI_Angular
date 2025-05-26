
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CustomerModel } from '../../../models/CustomerModel';
import { StorageService } from '../../../services/storage.service';
import { FeaturedPropertiesComponent } from '../../shared/featured-properties/featured-properties.component';
import { SearchComponent } from '../../shared/search/search.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-t6-home',
	standalone: true,
	imports: [RouterModule, SearchComponent, FeaturedPropertiesComponent,CommonModule, NgbModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
	templateUrl: './t6-home.component.html',
	styleUrls: ['./t6-home.component.scss', '../t6.component.scss'],
	providers: [Title, StorageService]
})
export class T6HomeComponent implements OnInit {
	customer!: CustomerModel | null;
  userForm!: FormGroup;


	constructor(private router: Router,
		private fb: FormBuilder,
		private titleService: Title,
	) { }

	ngOnInit(): void {
		this.titleService.setTitle("Home")
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
		this.router.navigate(['/t6', searchByMap ? 'map' : 'search'], {
			queryParams: {
				address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
			}
		});
	}
}
