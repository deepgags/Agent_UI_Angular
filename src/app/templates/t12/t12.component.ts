 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T12FooterComponent } from './t12-footer/t12-footer.component';
import { T12HeaderComponent } from './t12-header/t12-header.component';

@Component({
	selector: 'app-t12',
	standalone: true,
	imports: [T12HeaderComponent, T12FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t12.component.html',
	styleUrl: './t12.component.scss'
})
export class T12Component implements OnInit, OnDestroy {

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
