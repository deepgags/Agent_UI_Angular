import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment.development";

export interface DashboardData {
	registeredUsers: number;
	totalLeads: number;
	previousMonthLeads: number;
	currentMonthLeads: number;
}

@Injectable({
	providedIn: "root",
})
export class DashboardService {
	private baseUrl: string = environment.baseUrl;

	constructor(private http: HttpClient) {}

	getDashboardData(): Observable<DashboardData> {
		return this.http.get<DashboardData>(`${this.baseUrl}/customer/dashboard`).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return {
					registeredUsers: 0,
					totalLeads: 0,
					previousMonthLeads: 0,
					currentMonthLeads: 0,
				};
			}),
			catchError((error) => {
				console.error("Error fetching dashboard data:", error);
				return throwError(() => error);
			})
		);
	}
}
