import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";
import { TeamMemberModel } from "../models/TeamMemberModel";

@Injectable({
	providedIn: "root",
})
export class TeamService {
	private baseUrl: string = environment.baseUrl;

	constructor(private http: HttpClient) {}

	getTeamMembersPublic(): Observable<{ status: boolean; message: string; data: TeamMemberModel[] }> {
		return this.http.get<{ status: boolean; message: string; data: TeamMemberModel[] }>(
			`${this.baseUrl}/team/public`
		);
	}

	getTeamMemberDetailsPublic(id: string): Observable<{ status: boolean; message: string; data: TeamMemberModel }> {
		return this.http.get<{ status: boolean; message: string; data: TeamMemberModel }>(
			`${this.baseUrl}/team/details/${id}`
		);
	}

	getTeamMembers(): Observable<{ status: boolean; message: string; data: TeamMemberModel[] }> {
		return this.http.get<{ status: boolean; message: string; data: TeamMemberModel[] }>(`${this.baseUrl}/team`);
	}

	getTeamMemberById(id: string): Observable<{ status: boolean; message: string; data: TeamMemberModel }> {
		return this.http.get<{ status: boolean; message: string; data: TeamMemberModel }>(`${this.baseUrl}/team/${id}`);
	}

	addTeamMember(formData: FormData): Observable<{ status: boolean; message: string; data: TeamMemberModel }> {
		return this.http.post<{ status: boolean; message: string; data: TeamMemberModel }>(
			`${this.baseUrl}/team`,
			formData
		);
	}

	updateTeamMember(
		id: string,
		formData: FormData
	): Observable<{ status: boolean; message: string; data: TeamMemberModel }> {
		return this.http.patch<{ status: boolean; message: string; data: TeamMemberModel }>(
			`${this.baseUrl}/team/${id}`,
			formData
		);
	}

	deleteTeamMember(id: string): Observable<{ status: boolean; message: string }> {
		return this.http.delete<{ status: boolean; message: string }>(`${this.baseUrl}/team/${id}`);
	}

	reorderTeamMembers(memberIds: string[]): Observable<{ status: boolean; message: string; data: TeamMemberModel[] }> {
		return this.http.patch<{ status: boolean; message: string; data: TeamMemberModel[] }>(
			`${this.baseUrl}/team/reorder`,
			{ memberIds },
		);
	}
}
