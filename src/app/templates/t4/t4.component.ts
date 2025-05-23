import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T4FooterComponent } from './t4-footer/t4-footer.component';
import { T4HeaderComponent } from './t4-header/t4-header.component';

@Component({
	selector: 'app-t4',
	standalone: true,
	imports: [T4HeaderComponent, T4FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t4.component.html',
	styleUrl: './t4.component.scss'
})
export class T4Component implements OnInit, OnDestroy {

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
