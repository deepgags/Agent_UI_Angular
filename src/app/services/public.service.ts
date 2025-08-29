import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";
import { PropertyModel } from "../models/PropertyModel";

@Injectable({
	providedIn: "root",
})
export class PublicService {
	constructor(private http: HttpClient) {}

	submitContactForm(params: any): Observable<PropertyModel[]> {
		return this.http.post<PropertyModel[]>(`${environment.agentApiUrl}/leads`, params);
	}

	getLeadTypes(): Observable<any[]> {
		return this.http.get<any[]>(`${environment.agentApiUrl}/leads/lead-type`);
	}
}
