import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TeamMemberModel } from "../../../models/TeamMemberModel";
import { TeamService } from "../../../services/team.service";

@Component({
	selector: "app-team-details",
	imports: [RouterModule, CommonModule],
	templateUrl: "./team-details.component.html",
	styleUrl: "./team-details.component.scss",
})
export class TeamDetailComponent implements OnInit {
localImageUrl = environment.localImageUrl;
	teamMember: TeamMemberModel | null = null;
	loading = true;
	memberId: string | null = null;

	constructor(private route: ActivatedRoute, private teamService: TeamService) {}

	ngOnInit(): void {
		this.memberId = this.route.snapshot.paramMap.get("memberId");
		if (this.memberId) {
			this.getTeamMemberDetails();
		}
	}

	getTeamMemberDetails(): void {
		if (!this.memberId) return;

		this.loading = true;
		this.teamService.getTeamMemberDetailsPublic(this.memberId).subscribe({
			next: (response) => {
				if (response.status && response.data) {
					this.teamMember = response.data;
				}
				this.loading = false;
			},
			error: (error) => {
				console.error("Error loading team member:", error);
				this.loading = false;
			},
		});
	}
}
