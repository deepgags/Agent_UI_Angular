import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";

export interface Lead {
	_id: string;
	name: string;
	email: string;
	phone: string;
	message: string;
	leadSource: string;
	createdAt: string;
	leadMetaData?: Record<string, any>;
}

@Injectable({
	providedIn: "root",
})
export class LeadsService {
	constructor(private http: HttpClient) {}

	getLeads(): Observable<Lead[]> {
		return this.http.get<Lead[]>(`${environment.baseUrl}/leads`);
	}

	getLeadDetails(leadId: any): Observable<Lead> {
		return this.http.get<Lead>(`${environment.baseUrl}/leads/${leadId}`);
	}

	deleteLead(id: string | number): Observable<any> {
		return this.http.delete(`${environment.baseUrl}/leads/${id}`);
	}
}
