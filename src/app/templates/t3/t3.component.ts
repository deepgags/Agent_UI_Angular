import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T3FooterComponent } from './t3-footer/t3-footer.component';
import { T3HeaderComponent } from './t3-header/t3-header.component';


@Component({
	selector: 'app-t3',
	imports: [T3HeaderComponent, T3FooterComponent, RouterModule],
	templateUrl: './t3.component.html',
	styleUrl: './t3.component.scss',
})
export class T3Component {

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
