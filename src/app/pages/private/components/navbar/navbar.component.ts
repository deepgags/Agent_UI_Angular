import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { CustomerModel } from "../../../../models/CustomerModel";
import { CustomerService } from "../../../../services/customer.service";

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [CommonModule, RouterModule, MenuModule],
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
	items: MenuItem[] | undefined;
	agentData!: CustomerModel;

	constructor(private router: Router, private customerService: CustomerService) {
		this.items = [
			{
				label: "Account Options",
				items: [
					{
						label: "Change Password",
						icon: "fas fa-key",
						routerLink: "/change-password",
					},
					{
						label: "Log Out",
						icon: "fas fa-power-off",
						command: () => {
							this.logout();
						},
					},
				],
			},
		];
		this.getProfile();
	}

	logout() {
		this.customerService.logout();
		this.router.navigate(["/login"]);
	}

	getProfile() {
		this.customerService.getCustomer().subscribe({
			next: (response: any) => {
				if (response.status) {
					this.agentData = response.data;
				}
			},
			error: () => {},
			complete: () => {},
		});
	}
}
