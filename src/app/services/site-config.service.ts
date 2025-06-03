import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SiteConfig } from "../models/SiteConfig";

const SITE_CONFIG_STORAGE_KEY = "siteConfig";

@Injectable({
	providedIn: "root",
})
export class SiteConfigService {
	private currentConfigSubject = new BehaviorSubject<SiteConfig | null>(null);
	public currentConfig$: Observable<SiteConfig | null> = this.currentConfigSubject.asObservable();

	constructor() {
		// this.loadConfigFromStorage();
	}

	private loadConfigFromStorage(): void {
		if (typeof localStorage !== "undefined") {
			const storedConfig = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
			if (storedConfig) {
				try {
					const config = JSON.parse(storedConfig) as SiteConfig;
					if (config && config.websiteSettings.templateId) {
						// if (config.domain === window.location.hostname) {
						//   this.currentConfigSubject.next(config);
						// } else {
						//   localStorage.removeItem(SITE_CONFIG_STORAGE_KEY); // Stale config for different domain
						// }
						this.currentConfigSubject.next(config);
					}
				} catch (e) {
					console.error("Error parsing site config from localStorage", e);
					localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
				}
			}
		}
	}

	setConfig(config: SiteConfig, domain: string): void {
		const configToStore = { ...config, domain };
		this.currentConfigSubject.next(configToStore);
		// if (typeof localStorage !== 'undefined') {
		// 	try {
		// 		localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(configToStore));
		// 	} catch (e) {
		// 		console.error('Error saving site config to localStorage', e);
		// 	}
		// }
	}

	getConfigForDomain(domain: string): SiteConfig | null {
		const currentConfig = this.currentConfigSubject.getValue();
		if (currentConfig && currentConfig.websiteSettings.siteUrl === domain) {
			return currentConfig;
		}
		this.loadConfigFromStorage();
		const freshConfig = this.currentConfigSubject.getValue();
		if (freshConfig && freshConfig.websiteSettings.siteUrl === domain) {
			return freshConfig;
		}
		return null;
	}

	clearConfig(): void {
		this.currentConfigSubject.next(null);
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
		}
	}
}
