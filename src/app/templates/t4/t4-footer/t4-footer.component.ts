import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-t4-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule],
	templateUrl: './t4-footer.component.html',
	styleUrls: ['./t4-footer.component.scss', '../t4.component.scss']
})
export class T4FooterComponent implements OnInit {

	customer: CustomerModel | undefined;
	showSVG: boolean = false;
	showLogo: boolean = false;

	constructor(private storageService: StorageService) {

	}

	ngOnInit(): void {
		this.customer = this.storageService.getLoggedUserFromUserInfo();
		this.showSVG = typeof this.customer.logoImagePath === 'string' && this.customer.logoImagePath.endsWith('.svg');
	}

}
