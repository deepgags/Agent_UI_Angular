import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { SimpleTableComponent } from "../../../components/simple-table/simple-table.component";
import { FieldsType } from "../../../enums/fields-type.enum";
import { environment } from "../../../environments/environment.development";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { Testimonial, TestimonialService } from "../../../services/testimonial.service";
import { ManageTestimonialComponent } from "../manage-testimonial/manage-testimonial.component";

@Component({
	selector: "app-testimonial",
	imports: [
		CommonModule,
		TableModule,
		ButtonModule,
		PaginatorModule,
		ProgressSpinnerModule,
		SimpleTableComponent,
		DynamicDialogModule,
	],
	templateUrl: "./testimonial.component.html",
	styleUrl: "./testimonial.component.scss",
})
export class TestimonialComponent {
	testimonials: Testimonial[] = [];

	columns = [
		{
			field: "image",
			header: "Image",
			disableSort: true,
			fieldType: FieldsType.Image,
			width: "70px",
			imageBaseUrl: environment.localImageUrl,
		},
		{
			field: "customerName",
			header: "Customer Name",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "designation",
			header: "Designation",
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

	siteId = "";
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService,
		private dialogService: DialogService,
		private sharedDataService: SharedDataService,
		private testimonialService: TestimonialService,
	) {
		this.siteConfig = this.sharedDataService.siteData();
		this.siteId = this.sharedDataService.siteId();
	}

	ngOnInit() {
		this.getTestimonial();
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
			header: "Add Testimonial",
			draggable: false,
			modal: true,
			closable: true,
			width: "50%",
			data: {},
		});
		ref?.onClose.subscribe((refresh: boolean) => {
			if (refresh) {
				this.getTestimonial();
			}
		});
	};

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
			reject: () => {},
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
