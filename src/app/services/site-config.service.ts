import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SiteConfig } from "../models/SiteConfig";

@Injectable({
	providedIn: "root",
})
export class SiteConfigService {
	private currentConfigSubject = new BehaviorSubject<SiteConfig | null>(null);
	public currentConfig$: Observable<SiteConfig | null> = this.currentConfigSubject.asObservable();

	setConfig(config: SiteConfig, domain: string): void {
		const configToStore = { ...config, domain };
		this.currentConfigSubject.next(configToStore);
	}
}
