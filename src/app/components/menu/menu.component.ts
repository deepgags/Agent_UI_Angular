import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedDataService } from "../../services/shareddata.service";

@Component({
	selector: "app-menu",
	imports: [CommonModule, RouterModule],
	templateUrl: "./menu.component.html",
	styleUrl: "./menu.component.scss",
})
export class MenuComponent {
	siteMenu: any;
	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {
		this.siteMenu = this.sharedDataService.siteMenu();
	}
}
