import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@Component({
	selector: "app-private",
	imports: [RouterModule, NavbarComponent, SidebarComponent],
	templateUrl: "./private.component.html",
	styleUrl: "./private.component.scss",
})
export class PrivateComponent {}
