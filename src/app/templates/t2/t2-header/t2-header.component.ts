import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { UpperCase } from '../../../pipes/upper';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-t2-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, UpperCase],
	templateUrl: './t2-header.component.html',
	styleUrls: ['./t2-header.component.scss', '../t2.component.scss']
})
export class T2HeaderComponent implements OnInit {
	customer: CustomerModel | undefined;
	showSVG: boolean = false;
	showLogo: boolean = false;

	constructor(private storageService: StorageService,
		private router: Router
	) {

	}

	ngOnInit(): void {
		this.customer = this.storageService.getLoggedUserFromUserInfo();
		this.showSVG = typeof this.customer.logoImagePath === 'string' && this.customer.logoImagePath.endsWith('.svg');
	}

	updateProfile() {
		this.router.navigateByUrl("profile");
	}

	redirecToTemplate() {
		this.router.navigateByUrl("usertemplate");
	}
}
