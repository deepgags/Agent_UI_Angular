import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SiteConfig } from '../../../models/SiteConfig';
import { SiteConfigService } from '../../../services/site-config.service';
import { PhoneSearch } from '../../../pipes/phoneSearch';

@Component({
	selector: 'app-about',
	imports: [RouterModule,PhoneSearch],
	templateUrl: './about.component.html',
	styleUrl: './about.component.scss'
})
export class AboutComponent {
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;
	

	constructor(private siteConfigService: SiteConfigService) {}

	ngOnInit(): void {
	
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}
}
