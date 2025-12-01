import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CustomerModel } from "../../../../models/CustomerModel";

import { SharedDataService } from "../../../../services/shared-data.service";

@Component({
	selector: "app-sidebar",
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
	userData!: CustomerModel;

	constructor(private sharedDataService: SharedDataService) {}

	get isBroker(): boolean {
		return this.sharedDataService.isBroker();
	}

	get isAgent(): boolean {
		return this.sharedDataService.isAgent();
	}
}
