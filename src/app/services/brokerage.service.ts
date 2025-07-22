import { HttpClient } from "@angular/common/http";
import { inject, Injectable, resource, signal } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../environments/environment.development";
import { BrokerageTypeModel } from "../models/BrokerageTypeModel";

@Injectable({
	providedIn: "root",
})
export class BrokerageTypeService {
	private brokerageTypes: BrokerageTypeModel[] = [];
	query = signal<string>("");
	private baseUrl: string = environment.agentApiUrl;

	constructor(private http: HttpClient) {}
	getBrokerageTypes(): Observable<BrokerageTypeModel[]> {
		return this.http.get<BrokerageTypeModel[]>(`${this.baseUrl}/brokerages`);
	}
}
