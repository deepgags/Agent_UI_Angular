import { CommonModule, SlicePipe } from "@angular/common";
import { Component, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { environment } from "../../environments/environment.development";
import { TeamMemberModel } from "../../models/TeamMemberModel";
import { SharedDataService } from "../../services/shared-data.service";

@Component({
	selector: "app-team-card",
	imports: [CommonModule, RouterModule, SlicePipe],
	templateUrl: "./team-card.component.html",
	styleUrl: "./team-card.component.scss",
})
export class TeamCardComponent {
	team: TeamMemberModel[] | any[] = [];
	localImageUrl = environment.localImageUrl;

	constructor(private sharedDataService: SharedDataService) {
		effect(() => {
			this.team = this.sharedDataService.team();
		});
	}

	get isBroker(): boolean {
		return this.sharedDataService.isBroker();
	}
}
