import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../models/SiteConfig';
import { PhoneSearch } from '../../../pipes/phoneSearch';

@Component({
	selector: 'app-t2-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, RouterModule],
	templateUrl: './t2-header.component.html',
	styleUrls: ['./t2-header.component.scss', '../t2.component.scss']
})
export class T2HeaderComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;
	constructor() { }

	ngOnInit(): void { }
}
