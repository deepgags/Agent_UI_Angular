 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T16HeaderComponent } from './t16-header/t16-header.component';
import { T16FooterComponent } from './t16-footer/t16-footer.component';

@Component({
	selector: 'app-t16',
	standalone: true,
	imports: [T16HeaderComponent, T16FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t16.component.html',
	styleUrl: './t16.component.scss'
})
export class T16Component implements OnInit, OnDestroy {

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
