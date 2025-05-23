import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { SiteConfig } from '../../../models/SiteConfig';


@Component({
	selector: 'app-t1-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, RouterModule],
	templateUrl: './t1-header.component.html',
	styleUrls: ['./t1-header.component.scss', '../t1.component.scss']
})
export class T1HeaderComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() { }

	ngOnInit(): void { }
}
