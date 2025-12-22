import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
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
		CheckboxModule,
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
			showHomeWorthPage: new FormControl(false),
			showSellingInNeighbourHooddPage: new FormControl(""),
			showFindDreamHomePage: new FormControl(""),
		});

		this.getProfile();
	}

	getProfile() {
		this.customerService.getCustomer().subscribe({
			next: (response: any) => {
				if (response.status) {
					if (response.data.websiteSettings) {
						const { showHomeWorthPage, showSellingInNeighborHoodPage, showFindDreamHomePage } =
							response.data.websiteSettings;
						this.agentForm.patchValue({
							showHomeWorthPage: showHomeWorthPage,
							showSellingInNeighborHoodPage: showSellingInNeighborHoodPage,
							showFindDreamHomePage: showFindDreamHomePage,
						});
					}
				}
			},
			error: () => {
				this.notificationService.showError("An error has occurred while getting your settings.");
			},
			complete: () => {},
		});
	}

	save() {
		const { valid } = this.agentForm;
		if (valid) {
			this.loadingService.loadingOn();
			const { showHomeWorthPage, showSellingInNeighborHoodPage, showFindDreamHomePage } = this.agentForm.value;
			const params = {
				websiteSettings: {
					showHomeWorthPage,
					showSellingInNeighborHoodPage,
					showFindDreamHomePage,
				},
			};
			this.customerService.updatePageContent(params).subscribe({
				next: (v) => {},
				error: (e) => {
					this.notificationService.showError(
						e.error.message || "Something went wrong while updating settings."
					);
				},
				complete: () => {
					this.notificationService.showSuccess("Page settings updated.");
					this.loadingService.loadingOff();
				},
			});
		} else {
			this.agentForm.markAllAsTouched();
			this.notificationService.showSuccess("One or more required fields are missing or invalid.");
		}
	}
}
