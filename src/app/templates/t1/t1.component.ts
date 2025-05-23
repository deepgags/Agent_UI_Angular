import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T1FooterComponent } from './t1-footer/t1-footer.component';
import { T1HeaderComponent } from './t1-header/t1-header.component';

@Component({
	selector: 'app-t1',
	standalone: true,
	imports: [T1HeaderComponent, T1FooterComponent, RouterModule, CommonModule], // Added CommonModule
	templateUrl: './t1.component.html',
	styleUrl: './t1.component.scss'
})
export class T1Component implements OnInit, OnDestroy {

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
