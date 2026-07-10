import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";
import { SharedDataService } from "./shared-data.service";

@Injectable({
	providedIn: "root",
})
export class CitiesService {
	constructor(private http: HttpClient, private sharedDataService: SharedDataService) {}

	getCities(): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.sharedDataService.userToken()}`,
		});
		return this.http.get(`${environment.baseUrl}/cities`, { headers });
	}

	addCity(cityData: FormData): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.sharedDataService.userToken()}`,
		});
		return this.http.post(`${environment.baseUrl}/cities`, cityData, { headers });
	}

	deleteCity(cityId: string): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.sharedDataService.userToken()}`,
		});
		return this.http.delete(`${environment.baseUrl}/cities/${cityId}`, { headers });
	}

	reorderCities(cityIds: string[]): Observable<any> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.sharedDataService.userToken()}`,
		});
		return this.http.patch(`${environment.baseUrl}/cities/reorder`, { cityIds }, { headers });
	}
}
