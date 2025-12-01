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

	getTeamMembers(): Observable<{ status: boolean; message: string; data: TeamMemberModel[] }> {
		return this.http.get<{ status: boolean; message: string; data: TeamMemberModel[] }>(`${this.baseUrl}/team`);
	}

	addTeamMember(
		member: Omit<
			TeamMemberModel,
			"_id" | "brokerId" | "createdAt" | "updatedAt" | "isDeleted" | "createdBy" | "updatedBy"
		>
	): Observable<{ status: boolean; message: string; data: TeamMemberModel }> {
		return this.http.post<{ status: boolean; message: string; data: TeamMemberModel }>(
			`${this.baseUrl}/team`,
			member
		);
	}

	updateTeamMember(
		id: string,
		member: Partial<TeamMemberModel>
	): Observable<{ status: boolean; message: string; data: TeamMemberModel }> {
		return this.http.patch<{ status: boolean; message: string; data: TeamMemberModel }>(
			`${this.baseUrl}/team/${id}`,
			member
		);
	}

	deleteTeamMember(id: string): Observable<{ status: boolean; message: string }> {
		return this.http.delete<{ status: boolean; message: string }>(`${this.baseUrl}/team/${id}`);
	}
}
