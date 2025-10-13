import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";

@Injectable({
	providedIn: "root",
})
export class BrokerageTypeService {
	private baseUrl: string = environment.baseUrl;

	constructor(private http: HttpClient) {}
	getBrokerageTypes() {
		return this.http.get(`${this.baseUrl}/properties/brokerages`);
	}
}
