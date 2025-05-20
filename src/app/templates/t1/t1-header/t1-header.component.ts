import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SiteConfig } from '../../../app.component';
import { PhoneSearch } from '../../../pipes/phoneSearch';


@Component({
	selector: 'app-t1-header',
	imports: [CommonModule, AngularSvgIconModule, PhoneSearch, RouterModule],
	templateUrl: './t1-header.component.html',
	styleUrls: ['./t1-header.component.scss', '../t1.component.scss']
})
export class T1HeaderComponent implements OnInit {
	@Input('siteConfig') siteConfig: SiteConfig | null = null;
	constructor(private router: Router) { }

	ngOnInit(): void {

	}

	updateProfile() {
		this.router.navigateByUrl("profile");
	}
}
