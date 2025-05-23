 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T9FooterComponent } from './t9-footer/t9-footer.component';
import { T9HeaderComponent } from './t9-header/t9-header.component';

@Component({
	selector: 'app-t9',
	standalone: true,
	imports: [T9HeaderComponent, T9FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t9.component.html',
	styleUrl: './t9.component.scss'
})
export class T9Component implements OnInit, OnDestroy {

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
