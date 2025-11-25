import { HttpClient } from "@angular/common/http";
import { DOCUMENT, Inject, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment.development";
import { CreatePageRequest, Page, UpdatePageRequest } from "../models/Page";

@Injectable({
	providedIn: "root",
})
export class PageService {
	private baseUrl: string = environment.baseUrl;

	constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {}

	getPages(): Observable<Page[]> {
		return this.http.get<Page[]>(`${this.baseUrl}/page`).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return [];
			}),
			catchError((error) => {
				console.error("Error fetching pages:", error);
				return throwError(() => error);
			})
		);
	}

	getPageById(id: string): Observable<Page> {
		return this.http.get<Page>(`${this.baseUrl}/page/${id}`).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				throw new Error("Page not found");
			}),
			catchError((error) => {
				console.error("Error fetching page:", error);
				return throwError(() => error);
			})
		);
	}

	getPageBySlug(slug: string): Observable<Page> {
		const domain = this.document.location.hostname;
		const params = domain ? `?domain=${domain}` : "";
		return this.http.get<Page>(`${this.baseUrl}/page/slug/${slug}${params}`).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				throw new Error("Page not found");
			}),
			catchError((error) => {
				console.error("Error fetching page by slug:", error);
				return throwError(() => error);
			})
		);
	}

	createPage(pageData: CreatePageRequest): Observable<Page> {
		return this.http.post<Page>(`${this.baseUrl}/page`, pageData).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return pageData as any;
			}),
			catchError((error) => {
				console.error("Error creating page:", error);
				return throwError(() => error);
			})
		);
	}

	updatePage(id: string, pageData: UpdatePageRequest): Observable<Page> {
		return this.http.patch<Page>(`${this.baseUrl}/page/${id}`, pageData).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return pageData as any;
			}),
			catchError((error) => {
				console.error("Error updating page:", error);
				return throwError(() => error);
			})
		);
	}

	deletePage(id: string): Observable<void> {
		return this.http.delete<void>(`${this.baseUrl}/page/${id}`).pipe(
			catchError((error) => {
				console.error("Error deleting page:", error);
				return throwError(() => error);
			})
		);
	}
}
