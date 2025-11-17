import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { LeadDetailComponent } from "../../../components/dialogs/lead-detail/lead-detail.component";
import { SimpleTableComponent } from "../../../components/simple-table/simple-table.component";
import { FieldsType } from "../../../enums/fields-type.enum";
import { Lead, LeadsService } from "../../../services/leads.service";
import { NotificationService } from "../../../services/notification.service";

@Component({
	selector: "app-leads",
	standalone: true,
	imports: [
		CommonModule,
		TableModule,
		ButtonModule,
		PaginatorModule,
		ProgressSpinnerModule,
		DynamicDialogModule,
		SimpleTableComponent,
	],
	templateUrl: "./leads.component.html",
	styleUrls: ["./leads.component.scss"],
	providers: [DialogService],
})
export class LeadsComponent implements OnInit {
	leads: Lead[] = [];

	columns = [
		{
			field: "name",
			header: "Customer Name",
			disableSort: false,
			fieldType: FieldsType.Text,
			// width: "190px",
		},
		{
			field: "email",
			header: "Email",
			disableSort: false,
			fieldType: FieldsType.Text,
			// width: '180px'
		},
		{
			field: "phone",
			header: "Phone",
			disableSort: false,
			fieldType: FieldsType.Text,
			// width: '180px'
		},
		{
			field: "userType",
			header: "User Type",
			disableSort: false,
			fieldType: FieldsType.Text,
			// width: '130px'
		},
		{
			field: "message",
			header: "Message",
			disableSort: true,
			fieldType: FieldsType.Text,
			// width: '180px'
		},
		{
			field: "mlsId",
			header: "MLS ID",
			disableSort: true,
			fieldType: FieldsType.Text,
			// width: '180px'
		},
		{
			field: "createdAt",
			header: "Lead Date",
			disableSort: true,
			fieldType: FieldsType.Date,
			// width: '80px'
		},
		{
			field: "leadSource",
			header: "Created From",
			disableSort: false,
			fieldType: FieldsType.Capitalize,
		},
		{
			field: "leadType",
			header: "Lead Type",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "Action",
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

	private dialogService = inject(DialogService);

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
		this.leadsService.deleteLead(lead._id).subscribe({
			next: () => {
				this.leads.splice(index, 1);
				this.loading = false;
				this.notificationService.showSuccess("Lead removed.");
			},
			error: (error) => {
				this.loading = false;
				console.error("Error deleting lead:", error);
				this.notificationService.showError("Unable to remove lead.");
			},
		});
	};

	openLeadDetails = (data: any, index: number) => {
		const leadId = data._id;

		if (!leadId) {
			this.notificationService.showError("Lead ID not found");
			return;
		}

		this.dialogService.open(LeadDetailComponent, {
			header: "Lead Details",
			width: "600px",
			modal: true,
			closable: true,
			closeOnEscape: true,
			data: {
				leadId: leadId,
			},
		});
	};
}
