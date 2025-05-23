import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { SiteConfig } from '../../../models/SiteConfig';

@Component({
	selector: 'app-t11-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule],
	templateUrl: './t11-footer.component.html',
	styleUrls: ['./t11-footer.component.scss', '../t11.component.scss'],
})
export class T11FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
