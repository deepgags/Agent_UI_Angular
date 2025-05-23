import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { SiteConfig } from '../../../models/SiteConfig';


@Component({
	selector: 'app-t10-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, RouterModule],
	templateUrl: './t10-header.component.html',
	styleUrls: ['./t10-header.component.scss', '../t10.component.scss']
})
export class T10HeaderComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() { }

	ngOnInit(): void { }
}
