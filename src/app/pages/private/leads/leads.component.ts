import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { LeadDetailComponent } from "../../../components/dialogs/lead-detail/lead-detail.component";
import { SimpleTableComponent } from "../../../components/simple-table/simple-table.component";
import { FieldsType } from "../../../enums/fields-type.enum";
import { Lead, LeadsService } from "../../../services/leads.service";
import { NotificationService } from "../../../services/notification.service";

const SEARCHABLE_FIELDS = [
	{ label: "Customer Name", value: "name" },
	{ label: "Email", value: "email" },
	{ label: "Phone", value: "phone" },
	{ label: "User Type", value: "userType" },
	{ label: "Message", value: "message" },
	{ label: "MLS ID", value: "mlsId" },
	{ label: "Created From", value: "leadSource" },
	{ label: "Lead Type", value: "leadType" },
];

@Component({
	selector: "app-leads",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		PaginatorModule,
		ProgressSpinnerModule,
		DynamicDialogModule,
		SelectModule,
		SimpleTableComponent,
	],
	templateUrl: "./leads.component.html",
	styleUrls: ["./leads.component.scss"],
	providers: [DialogService],
})
export class LeadsComponent implements OnInit {
	leads: Lead[] = [];
	filteredLeads: Lead[] = [];

	searchFields = [{ label: "All Fields", value: "all" }, ...SEARCHABLE_FIELDS];
	selectedField: string = "all";
	searchText: string = "";

	columns = [
		{
			field: "userType",
			header: "User Type",
			disableSort: false,
			fieldType: FieldsType.Text,
			// width: '130px'
		},
		{
			field: "createdAt",
			header: "Lead Date",
			disableSort: true,
			fieldType: FieldsType.Date,
			// width: '80px'
		},
		{
			field: "name",
			secondaryFields: ["email", "phone"],
			phoneFields: ["phone"],
			header: "Customer",
			disableSort: false,
			fieldType: FieldsType.Contact,
			// width: '220px'
		},
		{
			field: "message",
			header: "Message",
			disableSort: true,
			fieldType: FieldsType.Text,
			width: "550px",
		},
		{
			field: "mlsId",
			header: "MLS ID",
			disableSort: true,
			fieldType: FieldsType.Text,
			// width: '180px'
		},
		{
			field: "leadSource",
			secondaryFields: ["leadType"],
			capitalizeFields: ["leadSource"],
			header: "Created From / Lead Type",
			disableSort: false,
			fieldType: FieldsType.Contact,
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
				this.applyFilter();
				this.loading = false;
			},
			error: (error) => {
				this.error = "Failed to load leads";
				this.loading = false;
				console.error("Error loading leads:", error);
			},
		});
	}

	applyFilter(): void {
		const term = this.searchText.trim().toLowerCase();

		if (!term) {
			this.filteredLeads = this.leads;
			return;
		}

		const fields = this.selectedField === "all" ? SEARCHABLE_FIELDS.map((f) => f.value) : [this.selectedField];

		this.filteredLeads = this.leads.filter((lead: any) =>
			fields.some((field) => (lead[field] ?? "").toString().toLowerCase().includes(term)),
		);
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
				this.leads = this.leads.filter((l: any) => l._id !== lead._id);
				this.applyFilter();
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
