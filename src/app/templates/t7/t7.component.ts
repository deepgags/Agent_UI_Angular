 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfigService } from '../../services/site-config.service';
import { T7FooterComponent } from './t7-footer/t7-footer.component';
import { T7HeaderComponent } from './t7-header/t7-header.component';
import { SiteConfig } from '../../models/SiteConfig';

@Component({
	selector: 'app-t7',
	standalone: true,
	imports: [T7HeaderComponent, T7FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t7.component.html',
	styleUrl: './t7.component.scss'
})
export class T7Component implements OnInit, OnDestroy {

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
