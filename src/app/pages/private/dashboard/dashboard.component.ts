import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { DashboardData, DashboardService } from "../../../services/dashboard.service";

@Component({
	selector: "app-admin",
	standalone: true,
	imports: [CommonModule, TableModule, CardModule, ProgressSpinnerModule],
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
})
export class AdminComponent implements OnInit {
	dashboardData: DashboardData = {
		registeredUsers: 0,
		totalLeads: 0,
		previousMonthLeads: 0,
		currentMonthLeads: 0,
	};

	loading: boolean = false;
	error: string | null = null;

	constructor(private dashboardService: DashboardService) {}

	ngOnInit() {
		this.loadDashboardData();
	}

	loadDashboardData() {
		this.loading = true;
		this.error = null;
		this.dashboardService.getDashboardData().subscribe({
			next: (data) => {
				this.dashboardData = data;
				this.loading = false;
			},
			error: (error) => {
				this.error = "Failed to load dashboard data";
				this.loading = false;
				console.error("Error loading dashboard data:", error);
			},
		});
	}
}
