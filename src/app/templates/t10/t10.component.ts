 import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T10FooterComponent } from './t10-footer/t10-footer.component';
import { T10HeaderComponent } from './t10-header/t10-header.component';

@Component({
	selector: 'app-t10',
	standalone: true,
	imports: [T10HeaderComponent, T10FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t10.component.html',
	styleUrl: './t10.component.scss'
})
export class T10Component implements OnInit, OnDestroy {

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
