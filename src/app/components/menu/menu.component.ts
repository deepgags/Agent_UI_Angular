import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MenuItem } from "../../models/MenuItem";
import { SharedDataService } from "../../services/shared-data.service";

@Component({
	selector: "app-menu",
	imports: [CommonModule, RouterModule],
	templateUrl: "./menu.component.html",
	styleUrl: "./menu.component.scss",
})
export class MenuComponent {
	siteMainMenu: MenuItem[] | any[] = {} as MenuItem[];
	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteMainMenu = this.sharedDataService.mainMenu();
	}
}
