 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T13HeaderComponent } from './t13-header/t13-header.component';
import { T13FooterComponent } from './t13-footer/t13-footer.component';

@Component({
	selector: 'app-t13',
	standalone: true,
	imports: [T13HeaderComponent, T13FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t13.component.html',
	styleUrl: './t13.component.scss'
})
export class T13Component implements OnInit, OnDestroy {

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
