import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { SiteConfig } from '../../../models/SiteConfig';

@Component({
	selector: 'app-t10-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule],
	templateUrl: './t10-footer.component.html',
	styleUrls: ['./t10-footer.component.scss', '../t10.component.scss'],
})
export class T10FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
