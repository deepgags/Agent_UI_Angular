import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MenuItem } from "../../models/MenuItem";
import { SharedDataService } from "../../services/shared-data.service";
import { SideMenuComponent } from "../side-menu/side-menu.component";

@Component({
	selector: "app-menu",
	imports: [CommonModule, RouterModule, SideMenuComponent],
	templateUrl: "./menu.component.html",
	styleUrl: "./menu.component.scss",
})
export class MenuComponent {
	siteMainMenu: MenuItem[] | any[] = [];
	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteMainMenu = this.sharedDataService.mainMenu();
	}
}
