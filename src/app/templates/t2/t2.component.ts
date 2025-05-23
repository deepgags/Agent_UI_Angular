import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteConfig } from '../../models/SiteConfig';
import { SiteConfigService } from '../../services/site-config.service';
import { T2FooterComponent } from './t2-footer/t2-footer.component';
import { T2HeaderComponent } from './t2-header/t2-header.component';


@Component({
	selector: 'app-t2',
	imports: [T2HeaderComponent, T2FooterComponent, RouterModule],
	templateUrl: './t2.component.html',
	styleUrl: './t2.component.scss',
})
export class T2Component {

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
