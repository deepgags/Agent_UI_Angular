import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { EditorModule } from "primeng/editor";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { CustomerService } from "../../../services/customer.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";

@Component({
	selector: "app-manager",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		SelectModule,
		InputMaskModule,
		IftaLabelModule,
		TextareaModule,
		EditorModule,
	],
	templateUrl: "./manager.component.html",
	styleUrls: ["./manager.component.scss"],
})
export class ManagerComponent {
	agentForm!: FormGroup;

	constructor(
		private customerService: CustomerService,
		private notificationService: NotificationService,
		private loadingService: LoadingService
	) {}

	ngOnInit() {
		this.agentForm = new FormGroup({
			aboutText: new FormControl(""),
			contactText: new FormControl(""),
			sellingYourHouseText: new FormControl(""),
			renovatingForResellText: new FormControl(""),
			commonSellingMistakeText: new FormControl(""),
			buyerText: new FormControl(""),
		});

		this.getProfile();
	}

	getProfile() {
		this.customerService.getCustomer().subscribe({
			next: (response: any) => {
				if (response.status) {
					if (response.data.websiteSettings) {
						this.agentForm.patchValue({
							aboutText: response.data.websiteSettings.aboutText || "",
							contactText: response.data.websiteSettings.contactText || "",
							sellingYourHouseText: response.data.websiteSettings.sellingYourHouseText || "",
							renovatingForResellText: response.data.websiteSettings.renovatingForResellText || "",
							commonSellingMistakeText: response.data.websiteSettings.commonSellingMistakeText || "",
							buyerText: response.data.websiteSettings.buyerText || "",
						});
					}
				}
			},
			error: () => {
				this.notificationService.showSuccess("An error has occurred while getting customer information");
			},
			complete: () => {},
		});
	}

	save() {
		const { valid } = this.agentForm;
		if (valid) {
			this.loadingService.loadingOn();

			const params = {
				websiteSettings: {
					aboutText: this.agentForm.get("aboutText")?.value || "",
					contactText: this.agentForm.get("contactText")?.value || "",
					sellingYourHouseText: this.agentForm.get("sellingYourHouseText")?.value || "",
					renovatingForResellText: this.agentForm.get("renovatingForResellText")?.value || "",
					commonSellingMistakeText: this.agentForm.get("commonSellingMistakeText")?.value || "",
					buyerText: this.agentForm.get("buyerText")?.value || "",
				},
			};
			this.customerService.update(params).subscribe({
				next: (v) => {},
				error: (e) => {
					this.notificationService.showSuccess(e.error.message || "Something went wrong while updating information.");
				},
				complete: () => {
					this.notificationService.showSuccess("Page content updated successfully");
					this.loadingService.loadingOff();
				},
			});
		} else {
			this.agentForm.markAllAsTouched();
			this.notificationService.showSuccess("One or more required fields are missing or invalid.");
		}
	}
}
