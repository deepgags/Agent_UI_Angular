import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";

@Injectable({
	providedIn: "root",
})
export class TemplateService {
	private baseUrl: string = environment.agentApiUrl;

	constructor(private http: HttpClient) {}

	getTemplates() {
		return this.http.get(`${this.baseUrl}/templates`);
	}
}
