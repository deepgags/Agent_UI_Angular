import { Injectable } from '@angular/core';
// import { CustomerModel } from '../models/CustomerModel';
import crypto from 'crypto';
import { environment } from '../environments/environment';
import { CustomerModel } from '../models/CustomerModel';
import { InterestedUserModel } from '../models/InterestedUserModel';

@Injectable({
	providedIn: 'root'
})

export class StorageService {

	saveToken(token: string, key: string = "LoggedUserToken"): void {
		localStorage.setItem(key, token);
	}

	saveUserInfo(data: string, key: string = "LoggedUserInfo"): void {
		localStorage.setItem(key, data);
	}

	removeUserInfo(): void {
		localStorage.removeItem("LoggedUserInfo");
		localStorage.removeItem("LoggedUserToken");
		localStorage.removeItem("InterestedUser");
	}

	getLoggedUserFromUserInfo(): CustomerModel | null {
		const userData = localStorage.getItem("LoggedUserInfo") ?? "";
		if (userData) {
			return JSON.parse(userData) as CustomerModel
		}
		return null
	}

	getInterestedUser(): InterestedUserModel {
		const userData = localStorage.getItem("InterestedUser") ?? "";
		return userData ? JSON.parse(userData) as InterestedUserModel : new InterestedUserModel();
	}
}