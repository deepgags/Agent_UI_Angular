import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../models/SiteConfig';
import { PhoneSearch } from '../../../pipes/phoneSearch';


@Component({
	selector: 'app-t2-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule],
	templateUrl: './t2-footer.component.html',
	styleUrls: ['./t2-footer.component.scss', '../t2.component.scss']
})
export class T2FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;
	constructor() { }

	ngOnInit(): void {
	}

}
