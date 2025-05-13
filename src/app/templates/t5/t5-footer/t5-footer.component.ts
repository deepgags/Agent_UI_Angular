import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-t5-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule],
	templateUrl: './t5-footer.component.html',
	styleUrls: ['./t5-footer.component.scss', '../t5.component.scss']
})
export class T5FooterComponent implements OnInit {

	customer?: CustomerModel | null;
	showSVG: boolean = false;
	showLogo: boolean = false;

	constructor(private storageService: StorageService) {

	}

	ngOnInit(): void {
		this.customer = this.storageService.getLoggedUserFromUserInfo();
		this.showSVG = typeof this.customer?.logoImagePath === 'string' && this.customer.logoImagePath.endsWith('.svg');
	}

}
