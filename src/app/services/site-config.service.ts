import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SiteConfig } from '../models/SiteConfig';

const SITE_CONFIG_STORAGE_KEY = 'siteConfig';

@Injectable({
	providedIn: 'root'
})
export class SiteConfigService {
	private currentConfigSubject = new BehaviorSubject<SiteConfig | null>(null);
	public currentConfig$: Observable<SiteConfig | null> = this.currentConfigSubject.asObservable();

	constructor() {
		this.loadConfigFromStorage();
	}

	private loadConfigFromStorage(): void {
		if (typeof localStorage !== 'undefined') {
			const storedConfig = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
			if (storedConfig) {
				try {
					const config = JSON.parse(storedConfig) as SiteConfig;
					// Basic validation: ensure it has a templateId and matches the current domain if domain was stored
					// More robust validation might be needed depending on your SiteConfig structure
					if (config && config.templateId) {
						// If you store the domain with the config, you can validate it here:
						// if (config.domain === window.location.hostname) {
						//   this.currentConfigSubject.next(config);
						// } else {
						//   localStorage.removeItem(SITE_CONFIG_STORAGE_KEY); // Stale config for different domain
						// }
						this.currentConfigSubject.next(config); // Simplified for now
					}
				} catch (e) {
					console.error('Error parsing site config from localStorage', e);
					localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
				}
			}
		}
	}

	setConfig(config: SiteConfig, domain: string): void {
		// Optionally, add the domain to the config object before storing
		const configToStore = { ...config, domain };
		this.currentConfigSubject.next(configToStore);
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(configToStore));
			} catch (e) {
				console.error('Error saving site config to localStorage', e);
			}
		}
	}

	getConfigForDomain(domain: string): SiteConfig | null {
		const currentConfig = this.currentConfigSubject.getValue();
		// Check if the loaded/current config is for the requested domain
		if (currentConfig && currentConfig.domain === domain) {
			return currentConfig;
		}
		// If not, try to load from storage again (might be redundant if constructor already did)
		// Or, this could be a place to trigger a fresh fetch if needed,
		// but for now, we assume AppComponent handles the fetching.
		this.loadConfigFromStorage(); // re-check storage
		const freshConfig = this.currentConfigSubject.getValue();
		if (freshConfig && freshConfig.domain === domain) {
			return freshConfig;
		}
		return null;
	}

	clearConfig(): void {
		this.currentConfigSubject.next(null);
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
		}
	}
}
