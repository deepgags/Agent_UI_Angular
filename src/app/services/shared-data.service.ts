import { Injectable, signal } from "@angular/core";
import { City } from "../models/City";
import { CustomerModel } from "../models/CustomerModel";
import { MenuItem } from "../models/MenuItem";
import { SiteConfig } from "../models/SiteConfig";
import { TeamMemberModel } from "../models/TeamMemberModel";

@Injectable({
	providedIn: "root",
})
export class SharedDataService {
	private _userToken = signal("");
	private _userData = signal<CustomerModel | null>(null);
	private _siteId = signal("");
	private _siteData = signal<SiteConfig | any>({} as SiteConfig);
	private _mainMenu = signal<MenuItem[] | any[]>([]);
	private _sideMenu = signal<MenuItem[] | any[]>([]);
	private _team = signal<TeamMemberModel[]>([]);
	private _cities = signal<City[]>([]);

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

	setTeam(_team: TeamMemberModel[]) {
		this._team.set(_team);
	}

	setCities(_cities: City[]) {
		this._cities.set(_cities);
	}

	setUserData(_userData: CustomerModel | null) {
		this._userData.set(_userData);
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

	get team() {
		return this._team;
	}

	get cities() {
		return this._cities;
	}

	get userData() {
		return this._userData;
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

	// Role-based access control methods
	isBroker(): boolean {
		const userData = this._userData();
		return userData?.role === "Broker";
	}

	isAgent(): boolean {
		const userData = this._userData();
		return userData?.role === "Agent";
	}

	getUserRole(): string | null {
		const userData = this._userData();
		return userData?.role || null;
	}

	hasRole(role: string): boolean {
		const userData = this._userData();
		return userData?.role === role;
	}
}
