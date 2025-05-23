 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T11FooterComponent } from './t11-footer/t11-footer.component';
import { T11HeaderComponent } from './t11-header/t11-header.component';

@Component({
	selector: 'app-t11',
	standalone: true,
	imports: [T11HeaderComponent, T11FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t11.component.html',
	styleUrl: './t11.component.scss'
})
export class T11Component implements OnInit, OnDestroy {

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
