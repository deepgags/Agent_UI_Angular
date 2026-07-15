import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";

@Injectable({
	providedIn: "root",
})
export class TemplateService {
	private baseUrl: string = environment.baseUrl;

	constructor(private http: HttpClient) {}

	getTemplates() {
		const token = localStorage.getItem("token");
		const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : {};
		return this.http.get(`${this.baseUrl}/templates`, { headers });
	}
}
