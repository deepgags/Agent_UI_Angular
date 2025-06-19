import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../models/SiteConfig';
import { PhoneSearch } from '../../../pipes/phoneSearch';

@Component({
	selector: 'app-t13-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule, RouterModule],
	templateUrl: './t13-footer.component.html',
	styleUrls: ['./t13-footer.component.scss', '../t13.component.scss'],
})
export class T13FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
