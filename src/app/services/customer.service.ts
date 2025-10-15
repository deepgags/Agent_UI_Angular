import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment.development";
import { CustomerModel } from "../models/CustomerModel";

@Injectable({
	providedIn: "root",
})
export class CustomerService {
	query = signal<string>("");
	private baseUrl: string = environment.baseUrl;

	constructor(private http: HttpClient) {}

	register(params: CustomerModel): Observable<any> {
		return this.http.post(`${this.baseUrl}/customer/register`, params);
	}

	verifyEmail(params: { emailAddress: string; authCode: string }): Observable<any> {
		return this.http.post(`${this.baseUrl}/customer/verify`, params);
	}

	login(params: { emailAddress: string; password: string }): Observable<any> {
		return this.http.post(`${this.baseUrl}/customer/login`, params);
	}

	save(customer: CustomerModel) {
		return this.http.post(this.baseUrl + "/save", customer);
	}

	update(params: any) {
		return this.http.patch(this.baseUrl + "/customer/update", params);
	}

	updatePageContent(params: any) {
		return this.http.patch(this.baseUrl + "/customer/update-content", params);
	}

	changeTemplate(params: any) {
		return this.http.patch(this.baseUrl + "/customer/set-template", params);
	}

	saveWebsiteSettings(settings: any) {
		return this.http.post(this.baseUrl + "/customer/website-settings", settings);
	}

	// customerExistWithSiteUrl(siteUrl: string): Observable<CustomerModel> {
	// 	return this.http.get<CustomerModel>(this.baseUrl + '/siteExist?siteUrl=' + siteUrl)
	// 		.pipe(map((result: any) => {
	// 			if (result && result.data) {
	// 				const customer: CustomerModel = result.data
	// 				return customer;
	// 			}
	// 			return this.customers[0];
	// 		}),
	// 			catchError(error => {
	// 				console.error('Error fetching customers:', error);
	// 				return throwError(() => error);
	// 			}));
	// }

	getCustomer() {
		return this.http.get(`${this.baseUrl}/customer/profile`);
	}

	getCustomers(emailAddress: string): Observable<CustomerModel> {
		return this.http.get<CustomerModel>(this.baseUrl + "/login?emailAddress=" + emailAddress).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
			}),
			catchError((error) => {
				console.error("Error fetching customers:", error);
				return throwError(() => error);
			})
		);
	}

	logout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
	}

	loginUser(params: { email: string; password: string }): Observable<any> {
		return this.http.post(`${this.baseUrl}/users/login`, params);
	}

	registerUser(params: {
		name: string;
		email: string;
		password: string;
		phone: string | number;
		siteId: string;
	}): Observable<any> {
		return this.http.post(`${this.baseUrl}/users/register`, params);
	}

	forgetPasswordUser(params: { email: string }): Observable<any> {
		return this.http.post(`${this.baseUrl}/users/forgot-password`, params);
	}
}
