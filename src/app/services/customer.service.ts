import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { CustomerModel } from '../models/CustomerModel';

@Injectable({
	providedIn: 'root'
})

export class CustomerService {

	private customers: CustomerModel[] = [];
	query = signal<string>("");
	private baseUrl: string = environment.agentApiUrl;

	constructor(private http: HttpClient) { }

	register(params: CustomerModel): Observable<any> {
		return this.http.post(`${this.baseUrl}/customer/register`, params);
	}

	verifyEmail(params: { emailAddress: string, authCode: string }): Observable<any> {
		return this.http.post(`${this.baseUrl}/customer/verify`, params);
	}

	login(params: { emailAddress: string, password: string }): Observable<any> {
		return this.http.post(`${this.baseUrl}/customer/login`, params);
	}

	save(customer: CustomerModel) {
		return this.http.post(this.baseUrl + '/save', customer);
	}

	update(params: any) {
		return this.http.patch(this.baseUrl + '/customer/update', params);
	}

	saveWebsiteSettings(settings: any) {
		return this.http.post(this.baseUrl + '/customer/website-settings', settings);
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
		return this.http.get(`${this.baseUrl}/customer/profile`)
	}

	templatePreviewAvailable(templateId: string): Observable<CustomerModel> {
		return this.http.get<CustomerModel>(this.baseUrl + '/customerByTemplateForPreview?templateid=' + templateId)
			.pipe(map((result: any) => {
				if (result && result.data && result.data.length > 0) {
					const customer: CustomerModel = result.data[0]
					return customer;
				}
				return this.customers[0];
			}),
				catchError(error => {
					console.error('Error fetching customers:', error);
					return throwError(() => error);
				}));
	}

	getCustomers(emailAddress: string): Observable<CustomerModel> {
		return this.http.get<CustomerModel>(this.baseUrl + '/login?emailAddress=' + emailAddress)
			.pipe(map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
			}),
				catchError(error => {
					console.error('Error fetching customers:', error);
					return throwError(() => error);
				})
			)
	}

	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('user');
	}

}
