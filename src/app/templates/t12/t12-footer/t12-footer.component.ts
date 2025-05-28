import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../models/SiteConfig';
import { PhoneSearch } from '../../../pipes/phoneSearch';

@Component({
	selector: 'app-t12-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule, RouterModule],
	templateUrl: './t12-footer.component.html',
	styleUrls: ['./t12-footer.component.scss', '../t12.component.scss'],
})
export class T12FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
