import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";

export interface Users {
	sno: number;
	pageName: string;
	pageTitle: string;
	pageIndex: number;
	dated: string;
}

@Injectable({
	providedIn: "root",
})
export class UsersService {
	constructor(private http: HttpClient) {}

	getUsers(): Observable<Users[]> {
		return this.http.get<Users[]>(`${environment.baseUrl}/users/all`);
	}

	deleteUser(id: string | number): Observable<any> {
		return this.http.delete(`${environment.baseUrl}/users/${id}`);
	}
}
