import { Injectable, signal } from "@angular/core";
import { SiteConfig } from "../models/SiteConfig";

@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	private _siteId = signal("");
	private _siteData = signal<SiteConfig | any>({} as SiteConfig);

	setSiteId(_siteId: string) {
		this._siteId.set(_siteId);
	}

	setSiteData(_siteData: any) {
		this._siteData.set(_siteData);
	}

	get siteId() {
		return this._siteId;
	}

	get siteData() {
		return this._siteData;
	}
}
