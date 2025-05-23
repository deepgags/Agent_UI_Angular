 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../app.component';
import { SiteConfigService } from '../../services/site-config.service';
import { T6FooterComponent } from './t6-footer/t6-footer.component';
import { T6HeaderComponent } from './t6-header/t6-header.component';

@Component({
	selector: 'app-t6',
	standalone: true,
	imports: [T6HeaderComponent, T6FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t6.component.html',
	styleUrl: './t6.component.scss'
})
export class T6Component implements OnInit, OnDestroy {

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
