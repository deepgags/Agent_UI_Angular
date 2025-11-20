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
	private _mainMenu = signal<MenuItem[] | any[]>([]);
	private _sideMenu = signal<MenuItem[] | any[]>([]);

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

	setMainMenu(_mainMenu: any[]) {
		this._mainMenu.set(_mainMenu);
	}

	setSideMenu(_sideMenu: any[]) {
		this._sideMenu.set(_sideMenu);
	}

	get siteId() {
		return this._siteId;
	}

	get siteData() {
		return this._siteData;
	}

	get mainMenu() {
		return this._mainMenu;
	}

	get sideMenu() {
		return this._sideMenu;
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
