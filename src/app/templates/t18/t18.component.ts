import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T18FooterComponent } from './t18-footer/t18-footer.component';
import { T18HeaderComponent } from './t18-header/t18-header.component';



@Component({
	selector: 'app-t18',
	standalone: true,
	imports: [T18FooterComponent, T18HeaderComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t18.component.html',
	styleUrl: './t18.component.scss'
})
export class T18Component implements OnInit, OnDestroy {

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
