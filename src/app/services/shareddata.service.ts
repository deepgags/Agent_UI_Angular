import { Injectable, signal } from "@angular/core";
import { MenuItem } from "../models/MenuItem";
import { SiteConfig } from "../models/SiteConfig";

@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	private _userToken = signal("");
	private _siteId = signal("");
	private _siteData = signal<SiteConfig | any>({} as SiteConfig);
	private _siteMenu = signal<MenuItem[] | any[]>({} as MenuItem[]);

	constructor() {
		const _userToken = localStorage.getItem("USER_TOKEN");
		if (_userToken) {
			this.setUserToken(_userToken);
		}
	}

	setSiteId(_siteId: string) {
		this._siteId.set(_siteId);
	}

	setSiteData(_siteData: any) {
		this._siteData.set(_siteData);
	}

	setSiteMenu(_siteMenu: any[]) {
		this._siteMenu.set(_siteMenu);
	}

	get siteId() {
		return this._siteId;
	}

	get siteData() {
		return this._siteData;
	}

	get siteMenu() {
		return this._siteMenu;
	}

	setUserToken(_userToken: string) {
		this._userToken.set(_userToken);
	}

	get userToken() {
		return this._userToken;
	}

	setUserTokenInStorage(_userToken: string) {
		localStorage.setItem("USER_TOKEN", _userToken);
		this.setUserToken(_userToken);
	}
}
