import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { SimpleTableComponent } from "../../../components/simple-table/simple-table.component";
import { FieldsType } from "../../../enums/fields-type.enum";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { SiteConfigService } from "../../../services/site-config.service";
import { Testimonial, TestimonialService } from "../../../services/testimonial.service";
import { ManageTestimonialComponent } from "../manage-testimonial/manage-testimonial.component";

@Component({
	selector: 'app-testimonial',
	imports: [CommonModule, TableModule, ButtonModule, PaginatorModule, ProgressSpinnerModule, SimpleTableComponent, DynamicDialogModule],
	templateUrl: './testimonial.component.html',
	styleUrl: './testimonial.component.scss'
})
export class TestimonialComponent {
	testimonials: Testimonial[] = [];

	columns = [
		{
			field: "customerName",
			header: "Customer Name",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "message",
			header: "Message",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "date",
			header: "Date",
			disableSort: false,
			fieldType: FieldsType.Date,
		},
		{
			field: "Action",
			header: "Action",
			disableSort: true,
			fieldType: FieldsType.Action,
		},
	];

	rows: number = 5;
	first: number = 0;
	loading: boolean = false;
	error: string | null = null;

	private notificationService = inject(NotificationService);

	private confirmationService = inject(ConfirmationService);

	private dialogService = inject(DialogService)

	private testimonialService = inject(TestimonialService);
	private siteConfigService = inject(SiteConfigService);

	siteId = "";
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;

	constructor() { }

	ngOnInit() {
		this.getTestimonial();
		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
				this.siteId = this.siteConfig?.id;
			}
		});
	}

	getTestimonial() {
		this.loading = true;
		this.error = null;

		this.testimonialService.getTestimonials(this.siteId).subscribe({
			next: (res: any) => {
				this.testimonials = res.data;
				this.loading = false;
			},
			error: (error) => {
				this.error = "Failed to load testimonial";
				this.loading = false;
				console.error("Error loading testimonial:", error);
			},
		});
	}

	addTestimonial = () => {
		const ref = this.dialogService.open(ManageTestimonialComponent, {
			header: 'Add Testimonial',
			draggable: false,
			modal: true,
			closable: true,
			width: "50%",
			data: {}
		});
		ref.onClose.subscribe((refresh: boolean) => {
			if (refresh) {
				this.getTestimonial();
			}
		});
	}

	deleteTestimonial = (testimonial: any, index: number) => {
		this.confirmationService.confirm({
			header: "Delete Testimonial",
			message: "Do you want to delete this Testimonial?",
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
				this._confirmDeleteTestimonial(testimonial, index);
			},
			reject: () => { },
		});
	};

	private _confirmDeleteTestimonial = (testimonial: any, index: number) => {
		this.loading = true;
		this.testimonialService.deleteTestimonial(testimonial._id).subscribe({
			next: () => {
				this.testimonials.splice(index, 1);
				this.loading = false;
				this.notificationService.showSuccess("Testimonial removed.");
			},
			error: (error) => {
				this.loading = false;
				console.error("Error deleting Testimonial:", error);
				this.notificationService.showError("Unable to remove Testimonial.");
			},
		});
	};
}
