import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T19HeaderComponent } from './t19-header/t19-header.component';
import { T19FooterComponent } from './t19-footer/t19-footer.component';


@Component({
	selector: 'app-t19',
	standalone: true,
	imports: [T19FooterComponent, T19HeaderComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t19.component.html',
	styleUrl: './t19.component.scss'
})
export class T19Component implements OnInit, OnDestroy {

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
