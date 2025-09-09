import { Component } from "@angular/core";
import { NavbarComponent } from "../../pages/private/components/navbar/navbar.component";
import { SidebarComponent } from "../../pages/private/components/sidebar/sidebar.component";

@Component({
	selector: "app-websetting",
	standalone: true,
	imports: [SidebarComponent, NavbarComponent],
	templateUrl: "./websetting.component.html",
	styleUrls: ["./websetting.component.scss"],
})
export class WebsettingComponent {}
