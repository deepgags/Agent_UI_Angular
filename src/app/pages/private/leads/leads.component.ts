import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { SimpleTableComponent } from "../../../components/simple-table/simple-table.component";
import { FieldsType } from "../../../enums/fields-type.enum";
import { Lead, LeadsService } from "../../../services/leads.service";
import { NotificationService } from "../../../services/notification.service";

@Component({
	selector: "app-leads",
	standalone: true,
	imports: [CommonModule, TableModule, ButtonModule, PaginatorModule, ProgressSpinnerModule, SimpleTableComponent],
	templateUrl: "./leads.component.html",
	styleUrls: ["./leads.component.scss"],
})
export class LeadsComponent implements OnInit {
	leads: Lead[] = [];

	columns = [
		{
			field: "name",
			header: "Customer Name",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "email",
			header: "Email",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "userType",
			header: "User Type",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "createdAt",
			header: "Lead Date",
			disableSort: true,
			fieldType: FieldsType.Date,
		},
		{
			field: "action",
			header: "Action",
			disableSort: true,
			fieldType: FieldsType.Action,
		},
	];

	pagedLeads: Lead[] = [];
	rows: number = 5;
	first: number = 0;
	loading: boolean = false;
	error: string | null = null;

	private notificationService = inject(NotificationService);

	private confirmationService = inject(ConfirmationService);

	private leadsService = inject(LeadsService);

	constructor() {}

	ngOnInit() {
		this.getLeads();
	}

	getLeads() {
		this.loading = true;
		this.error = null;
		this.leadsService.getLeads().subscribe({
			next: (res: any) => {
				this.leads = res.data;
				this.loading = false;
			},
			error: (error) => {
				this.error = "Failed to load leads";
				this.loading = false;
				console.error("Error loading leads:", error);
			},
		});
	}

	deleteLead = (lead: any, index: number) => {
		this.confirmationService.confirm({
			header: "Delete Lead",
			message: "Do you want to delete this lead?",
			icon: "bi bi-trash3",
			rejectLabel: "Cancel",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Delete",
				severity: "danger",
			},

			accept: () => {
				this._confirmDeleteLead(lead, index);
			},
			reject: () => {},
		});
	};

	private _confirmDeleteLead = (lead: any, index: number) => {
		this.loading = true;
		this.leadsService.deleteLead(lead.id || lead.sno).subscribe({
			next: () => {
				this.leads.splice(index, 1);
				this.loading = false;
				this.notificationService.showSuccess("Lead removed.");
			},
			error: (error) => {
				this.loading = false;
				console.error("Error deleting lead:", error);
				this.notificationService.showSuccess("Unable to remove lead.");
			},
		});
	};
}
