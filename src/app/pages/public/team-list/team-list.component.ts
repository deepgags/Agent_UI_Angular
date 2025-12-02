import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TeamMemberModel } from "../../../models/TeamMemberModel";
import { TeamService } from "../../../services/team.service";

@Component({
	selector: "app-team-list",
	imports: [RouterModule, CommonModule],
	templateUrl: "./team-list.component.html",
	styleUrl: "./team-list.component.scss",
})
export class TeamListComponent implements OnInit {
	teamMembers: TeamMemberModel[] = [];
	loading = true;

	constructor(private teamService: TeamService) {}

	ngOnInit(): void {
		this.getTeamMembers();
	}

	getTeamMembers(): void {
		this.loading = true;
		this.teamService.getTeamMembersPublic().subscribe({
			next: (response) => {
				if (response.status && response.data) {
					this.teamMembers = response.data;
				}
				this.loading = false;
			},
			error: (error) => {
				console.error("Error loading team members:", error);
				this.loading = false;
			},
		});
	}
}
