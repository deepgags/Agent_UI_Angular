import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../app.component';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { StorageService } from '../../../services/storage.service';


@Component({
	selector: 'app-t1-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule],
	templateUrl: './t1-footer.component.html',
	styleUrls: ['./t1-footer.component.scss', '../t1.component.scss'],
})
export class T1FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
