import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";

export interface Lead {
	sno: number;
	pageName: string;
	pageTitle: string;
	pageIndex: number;
	dated: string;
}

@Injectable({
	providedIn: "root",
})
export class LeadsService {
	constructor(private http: HttpClient) {}

	getLeads(): Observable<Lead[]> {
		return this.http.get<Lead[]>(`${environment.baseUrl}/leads`);
	}

	deleteLead(id: string | number): Observable<any> {
		return this.http.delete(`${environment.baseUrl}/leads/${id}`);
	}
}
