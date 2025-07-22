 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { t17FooterComponent } from './t17-footer/t17-footer.component';
import { t17HeaderComponent } from './t17-header/t17-header.component';


@Component({
	selector: 'app-t17',
	standalone: true,
	imports: [t17FooterComponent, t17HeaderComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t17.component.html',
	styleUrl: './t17.component.scss'
})
export class T17Component implements OnInit, OnDestroy {

	public siteConfig: SiteConfig | null = null;
	private siteConfigSubscription: Subscription | undefined;
	
	constructor(private siteConfigService: SiteConfigService) { }

	ngOnInit(): void {
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe(config => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}

	ngOnDestroy(): void {
		if (this.siteConfigSubscription) {
			this.siteConfigSubscription.unsubscribe();
		}
	}
}
