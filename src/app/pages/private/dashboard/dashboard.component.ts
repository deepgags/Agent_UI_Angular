import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { DashboardData, DashboardService } from "../../../services/dashboard.service";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-admin",
	standalone: true,
	imports: [CommonModule, TableModule, CardModule, ProgressSpinnerModule, RouterModule],
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

	constructor(
		private dashboardService: DashboardService,
		private sharedDataService: SharedDataService,
	) {}

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

	get greeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 17) return "Good afternoon";
		return "Good evening";
	}

	get greetingName(): string {
		const user = this.sharedDataService.userData();
		return user?.firstName || "there";
	}

	get currentDate(): Date {
		return new Date();
	}

	get leadTrendPercent(): number {
		const prev = this.dashboardData.previousMonthLeads;
		const curr = this.dashboardData.currentMonthLeads;
		if (prev === 0) return curr > 0 ? 100 : 0;
		return Math.round(((curr - prev) / prev) * 100);
	}

	get leadTrendUp(): boolean {
		return this.dashboardData.currentMonthLeads >= this.dashboardData.previousMonthLeads;
	}

	get progressPercent(): number {
		const prev = this.dashboardData.previousMonthLeads;
		const curr = this.dashboardData.currentMonthLeads;
		if (prev === 0) return curr > 0 ? 100 : 0;
		return Math.min(Math.round((curr / prev) * 100), 100);
	}

	get progressLabel(): string {
		const pct = this.progressPercent;
		if (pct >= 100) return "Exceeded last month!";
		if (pct >= 75) return "Almost there";
		if (pct >= 50) return "Halfway through";
		return "Getting started";
	}
}
