import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../models/SiteConfig';
import { PhoneSearch } from '../../../pipes/phoneSearch';
import { RouterModule } from '@angular/router';


@Component({
	selector: 'app-t3-footer',
	imports: [CommonModule, PhoneSearch, AngularSvgIconModule, RouterModule],
	templateUrl: './t3-footer.component.html',
	styleUrls: ['./t3-footer.component.scss', '../t3.component.scss']
})
export class T3FooterComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;
	constructor() { }

	ngOnInit(): void {
	}

}
