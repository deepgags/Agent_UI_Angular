import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment.development";
import { MenuItem, PredefinedPage } from "../models/MenuItem";

@Injectable({
	providedIn: "root",
})
export class MenuService {
	private baseUrl: string = environment.baseUrl;

	constructor(private http: HttpClient) {}

	getPredefinedPages(): Observable<PredefinedPage[]> {
		return this.http.get<PredefinedPage[]>(`${this.baseUrl}/menu/pages/predefined`).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return [];
			}),
			catchError((error) => {
				console.error("Error fetching predefined pages:", error);
				return throwError(() => error);
			})
		);
	}

	getMenu(): Observable<{ mainMenu: MenuItem[]; sideMenu: MenuItem[] }> {
		return this.http.get<{ mainMenu: MenuItem[]; sideMenu: MenuItem[] }>(`${this.baseUrl}/menu/`).pipe(
			map((result: any) => {
				if (result && result.data) {
					const mainMenu = (result.data.mainMenu || []).sort((a: MenuItem, b: MenuItem) => a.order - b.order);
					const sideMenu = (result.data.sideMenu || []).sort((a: MenuItem, b: MenuItem) => a.order - b.order);
					return { mainMenu, sideMenu };
				}
				return { mainMenu: [], sideMenu: [] };
			}),
			catchError((error) => {
				console.error("Error fetching menu items:", error);
				return throwError(() => error);
			})
		);
	}

	createMenuItem(menuItem: MenuItem | any): Observable<MenuItem> {
		return this.http.post<MenuItem>(`${this.baseUrl}/menu`, menuItem).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return menuItem;
			}),
			catchError((error) => {
				console.error("Error creating menu item:", error);
				return throwError(() => error);
			})
		);
	}

	updateMenuItem(id: string, menuItem: Partial<MenuItem>): Observable<MenuItem> {
		return this.http.patch<MenuItem>(`${this.baseUrl}/menu/${id}`, menuItem).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return menuItem as MenuItem;
			}),
			catchError((error) => {
				console.error("Error updating menu item:", error);
				return throwError(() => error);
			})
		);
	}

	deleteMenuItem(id: string): Observable<void> {
		return this.http.delete<void>(`${this.baseUrl}/menu/${id}`).pipe(
			catchError((error) => {
				console.error("Error deleting menu item:", error);
				return throwError(() => error);
			})
		);
	}

	reorderMenuItems(reorderData: { items: MenuItem[] }): Observable<MenuItem[]> {
		return this.http.patch<MenuItem[]>(`${this.baseUrl}/menu/reorder`, reorderData).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return reorderData.items;
			}),
			catchError((error) => {
				console.error("Error reordering menu items:", error);
				return throwError(() => error);
			})
		);
	}
}
