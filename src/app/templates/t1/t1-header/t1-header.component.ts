import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { UpperCase } from '../../../pipes/upper';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-t1-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, UpperCase],
	templateUrl: './t1-header.component.html',
	styleUrls: ['./t1-header.component.scss', '../t1.component.scss']
})
export class T1HeaderComponent implements OnInit {
	customer?: CustomerModel | null;
	showSVG: boolean = false;
	showLogo: boolean = false;

	constructor(private storageService: StorageService,
		private router: Router,
	) {

	}

	ngOnInit(): void {
		this.customer = this.storageService.getLoggedUserFromUserInfo();
	}

	updateProfile() {
		this.router.navigateByUrl("profile");
	}
}
