import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../app.component';
import { PhoneSearch } from '../../../pipes/phoneSearch';


@Component({
	selector: 'app-t5-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, RouterModule],
	templateUrl: './t5-header.component.html',
	styleUrls: ['./t5-header.component.scss', '../t5.component.scss']
})
export class T5HeaderComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;

	constructor() { }

	ngOnInit(): void { }
}
