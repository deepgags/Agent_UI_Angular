 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../app.component';
import { SiteConfigService } from '../../services/site-config.service';
import { T8FooterComponent } from './t8-footer/t8-footer.component';
import { T8HeaderComponent } from './t8-header/t8-header.component';

@Component({
	selector: 'app-t8',
	standalone: true,
	imports: [T8HeaderComponent, T8FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t8.component.html',
	styleUrl: './t8.component.scss'
})
export class T8Component implements OnInit, OnDestroy {

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
