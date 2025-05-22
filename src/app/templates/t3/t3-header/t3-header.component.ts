import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../app.component';
import { CustomerModel } from '../../../models/CustomerModel';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { UpperCase } from '../../../pipes/upper';
import { StorageService } from '../../../services/storage.service';

@Component({
	selector: 'app-t3-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, RouterModule],
	templateUrl: './t3-header.component.html',
	styleUrls: ['./t3-header.component.scss', '../t3.component.scss']
})
export class T3HeaderComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;
	constructor() { }

	ngOnInit(): void { }
}
