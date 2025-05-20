import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class StorageService {
	saveToken(token: string, key: string = "LoggedUserToken"): void {
		localStorage.setItem(key, token);
	}
}