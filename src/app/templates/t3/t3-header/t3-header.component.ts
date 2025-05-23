import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { SiteConfig } from '../../../models/SiteConfig';

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
