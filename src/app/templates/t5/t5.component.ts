 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../app.component';
import { SiteConfigService } from '../../services/site-config.service';
import { T5FooterComponent } from './t5-footer/t5-footer.component';
import { T5HeaderComponent } from './t5-header/t5-header.component';

@Component({
	selector: 'app-t5',
	standalone: true,
	imports: [T5HeaderComponent, T5FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t5.component.html',
	styleUrl: './t5.component.scss'
})
export class T5Component implements OnInit, OnDestroy {

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
