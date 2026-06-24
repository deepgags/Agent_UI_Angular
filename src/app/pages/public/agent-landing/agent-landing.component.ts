import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { NotificationService } from "../../../services/notification.service";
import { PublicService } from "../../../services/public.service";

@Component({
	selector: "app-agent-landing",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputMaskModule],
	templateUrl: "./agent-landing.component.html",
	styleUrl: "./agent-landing.component.scss",
})
export class AgentLandingComponent {
	isSubmitting = signal(false);
	submitted = signal(false);
	currentYear = new Date().getFullYear();

	form = new FormGroup({
		agentName:     new FormControl("", Validators.required),
		brokerageName: new FormControl("", Validators.required),
		phone:         new FormControl("", Validators.required),
		email:         new FormControl("", [Validators.required, Validators.email]),
		address:       new FormControl(""),
		designation:   new FormControl("", Validators.required),
	});

	constructor(
		private publicService: PublicService,
		private notificationService: NotificationService,
	) {}

	get agentName()     { return this.form.get("agentName"); }
	get brokerageName() { return this.form.get("brokerageName"); }
	get phone()         { return this.form.get("phone"); }
	get email()         { return this.form.get("email"); }
	get designation()   { return this.form.get("designation"); }

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.isSubmitting.set(true);
		const payload = {
			...this.form.value,
			leadSource: "agentLanding",
		};

		this.publicService.submitContactForm(payload).subscribe({
			next: () => {
				this.isSubmitting.set(false);
				this.submitted.set(true);
				this.form.reset();
			},
			error: () => {
				this.isSubmitting.set(false);
				this.notificationService.showError("Something went wrong. Please try again.");
			},
		});
	}
}
