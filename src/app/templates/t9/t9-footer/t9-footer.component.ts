import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../models/SiteConfig';
import { PhoneSearch } from '../../../pipes/phoneSearch';

@Component({
	selector: 'app-t9-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule, RouterModule],
	templateUrl: './t9-footer.component.html',
	styleUrls: ['./t9-footer.component.scss', '../t9.component.scss'],
})
export class T9FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
