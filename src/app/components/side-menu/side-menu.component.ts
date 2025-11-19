import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedDataService } from "../../services/shared-data.service";

@Component({
	selector: "app-side-menu",
	imports: [CommonModule, RouterModule],
	templateUrl: "./side-menu.component.html",
	styleUrl: "./side-menu.component.scss",
})
export class SideMenuComponent {
	siteSideMenu: any;
	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteSideMenu = this.sharedDataService.sideMenu();
	}
}
