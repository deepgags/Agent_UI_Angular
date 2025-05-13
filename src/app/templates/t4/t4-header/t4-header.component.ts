import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { UpperCase } from '../../../pipes/upper';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-t4-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, UpperCase],
	templateUrl: './t4-header.component.html',
	styleUrls: ['./t4-header.component.scss', '../t4.component.scss']
})
export class T4HeaderComponent implements OnInit {
	customer!: CustomerModel | null;
	showSVG: boolean = false;
	showLogo: boolean = false;

	constructor(private storageService: StorageService,
		private router: Router
	) {

	}

	ngOnInit(): void {
		this.customer = this.storageService.getLoggedUserFromUserInfo();
		this.showSVG = typeof this.customer?.logoImagePath === 'string' && this.customer.logoImagePath.endsWith('.svg');
	}

	updateProfile() {
		this.router.navigateByUrl("profile");
	}
}
