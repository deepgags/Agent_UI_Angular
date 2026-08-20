import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { MenuModule } from "primeng/menu";
import { ChangePasswordComponent } from "../../change-password/change-password.component";
import { environment } from "../../../../environments/environment.development";
import { CustomerModel } from "../../../../models/CustomerModel";
import { CustomerService } from "../../../../services/customer.service";
import { SharedDataService } from "../../../../services/shared-data.service";

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [CommonModule, RouterModule, MenuModule],
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.scss"],
	providers: [DialogService],
})
export class NavbarComponent {
	localImageUrl = environment.localImageUrl;
	items: MenuItem[] | undefined;
	agentData!: CustomerModel;

	constructor(
		private router: Router,
		private customerService: CustomerService,
		private sharedDataService: SharedDataService,
		private dialogService: DialogService,
	) {
		this.items = [
			{
				label: "Account Options",
				items: [
					{
						label: "Change Password",
						icon: "fas fa-key",
						command: () => {
							this.openChangePasswordDialog();
						},
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

	openChangePasswordDialog(): void {
		this.dialogService.open(ChangePasswordComponent, {
			header: "Change Password",
			width: "420px",
			modal: true,
			closable: true,
			dismissableMask: true,
		});
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
					this.sharedDataService.setUserData(response.data);
				}
			},
			error: () => {},
			complete: () => {},
		});
	}
}
