import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { SiteConfig } from '../../../models/SiteConfig';



@Component({
	selector: 'app-t1-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule],
	templateUrl: './t1-footer.component.html',
	styleUrls: ['./t1-footer.component.scss', '../t1.component.scss'],
})
export class T1FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() {

	}

	ngOnInit(): void {
	}

}
