import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-t5-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch],
	templateUrl: './t5-header.component.html',
	styleUrls: ['./t5-header.component.scss', '../t5.component.scss']
})
export class T5HeaderComponent implements OnInit {
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
