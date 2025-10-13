import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";

export interface Testimonial {
	id: string;
	customerName: string;
	message: string;
	date: string;
	designation?: string;
	image?: string;
}

@Injectable({
	providedIn: "root",
})
export class TestimonialService {
	constructor(private http: HttpClient) {}

	getTestimonials(siteId: string): Observable<Testimonial[]> {
		return this.http.get<Testimonial[]>(`${environment.baseUrl}/testimonials?siteId=${siteId}`);
	}

	addTestimonial(params: Partial<Testimonial>): Observable<Testimonial> {
		return this.http.post<Testimonial>(`${environment.baseUrl}/testimonials`, params);
	}

	deleteTestimonial(id: string): Observable<any> {
		return this.http.delete(`${environment.baseUrl}/testimonials/${id}`);
	}
}
