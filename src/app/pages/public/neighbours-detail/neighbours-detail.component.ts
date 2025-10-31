import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { SiteConfig } from "../../../models/SiteConfig";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";
import { SharedDataService } from "../../../services/shareddata.service";

@Component({
	selector: "app-neighbours-detail",
	imports: [CommonModule, RouterModule, ReactiveFormsModule, InputMaskModule, InputTextModule, IftaLabelModule],
	templateUrl: "./neighbours-detail.component.html",
	styleUrl: "./neighbours-detail.component.scss",
})
export class NeighboursDetailComponent implements OnInit {
	neighboursDetailForm: FormGroup;
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(
		private fb: FormBuilder,
		private publicService: PublicService,
		private notificationService: NotificationService,
		private sharedDataService: SharedDataService
	) {
		this.neighboursDetailForm = this.fb.group({
			searchQuery: new FormControl("", Validators.required),
			radius: new FormControl("", Validators.required),
			homeType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", Validators.required),
		});
	}

	ngOnInit() {
		this.siteConfig = this.sharedDataService.siteData();
	}

	get searchQuery() {
		return this.neighboursDetailForm.get("searchQuery");
	}
	get radius() {
		return this.neighboursDetailForm.get("radius");
	}
	get homeType() {
		return this.neighboursDetailForm.get("homeType");
	}
	get firstName() {
		return this.neighboursDetailForm.get("firstName");
	}
	get lastName() {
		return this.neighboursDetailForm.get("lastName");
	}
	get email() {
		return this.neighboursDetailForm.get("email");
	}
	get phone() {
		return this.neighboursDetailForm.get("phone");
	}

	submitNeighboursDetailForm() {
		if (this.neighboursDetailForm.invalid) {
			this.neighboursDetailForm.markAllAsTouched();
			this.notificationService.showError("Please fill all required fields correctly.");
			return;
		}

		const params = {
			...this.neighboursDetailForm.value,
			leadSource: "neighboursDetailForm",
			siteId: this.siteConfig?.id,
		};

		this.publicService.submitContactForm(params).subscribe({
			next: () => {
				this.notificationService.showSuccess("Your message has been sent successfully.");
				this.neighboursDetailForm.reset();
			},
			error: () => {
				this.notificationService.showError("Failed to send message. Please try again later.");
			},
		});
	}
}
