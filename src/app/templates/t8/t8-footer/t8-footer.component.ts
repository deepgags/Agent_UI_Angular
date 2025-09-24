
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../models/SiteConfig';
import { PhoneSearch } from '../../../pipes/phoneSearch';

@Component({
	selector: 'app-t8-footer',
	imports: [PhoneSearch, AngularSvgIconModule, RouterModule],
	templateUrl: './t8-footer.component.html',
	styleUrls: ['./t8-footer.component.scss', '../t8.component.scss'],
})
export class T8FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
