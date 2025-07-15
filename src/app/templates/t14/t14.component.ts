 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T14HeaderComponent } from './t14-header/t14-header.component';
import { T14FooterComponent } from './t14-footer/t14-footer.component';

@Component({
	selector: 'app-t14',
	standalone: true,
	imports: [T14HeaderComponent, T14FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t14.component.html',
	styleUrl: './t14.component.scss'
})
export class T14Component implements OnInit, OnDestroy {

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
