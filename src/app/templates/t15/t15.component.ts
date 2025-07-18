 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T15HeaderComponent } from './t15-header/t15-header.component';
import { T15FooterComponent } from './t15-footer/t15-footer.component';

@Component({
	selector: 'app-t15',
	standalone: true,
	imports: [T15HeaderComponent, T15FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t15.component.html',
	styleUrl: './t15.component.scss'
})
export class T15Component implements OnInit, OnDestroy {

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
