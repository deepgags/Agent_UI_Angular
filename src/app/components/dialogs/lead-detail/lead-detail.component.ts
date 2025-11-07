import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CamelCaseToCapitalize } from "../../../pipes/camelCaseToCapitalize";
import { Lead, LeadsService } from "../../../services/leads.service";

@Component({
	selector: "app-lead-detail",
	templateUrl: "./lead-detail.component.html",
	styleUrls: ["./lead-detail.component.scss"],
	standalone: true,
	imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule, CamelCaseToCapitalize],
})
export class LeadDetailComponent implements OnInit {
	lead: Lead | null = null;
	loading = true;
	error: string | null = null;

	private leadsService = inject(LeadsService);

	constructor(private ref: DynamicDialogRef, private dialogConfig: DynamicDialogConfig) {}

	ngOnInit() {
		const leadId = this.dialogConfig.data?.leadId;

		if (!leadId) {
			this.loading = false;
			this.error = "Lead ID not provided";
			return;
		}

		// Fetch lead details from server
		this.leadsService.getLeadDetails(leadId).subscribe({
			next: (res: any) => {
				this.lead = res.data;
				this.loading = false;
			},
			error: (error) => {
				this.loading = false;
				this.error = "Failed to load lead details";
				console.error("Error loading lead details:", error);
			},
		});
	}

	closeDialog() {
		this.ref.close();
	}

	// Helper method to get metadata keys
	getMetaDataKeys(metaData: Record<string, any> | undefined): string[] {
		return Object.keys(metaData || {});
	}
}
