import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerService } from "../../../services/customer.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
	const newPassword = control.get("newPassword")?.value;
	const confirmPassword = control.get("confirmPassword")?.value;
	return newPassword && confirmPassword && newPassword !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
	selector: "app-change-password",
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: "./change-password.component.html",
	styleUrl: "./change-password.component.scss",
})
export class ChangePasswordComponent {
	form: FormGroup;
	submitting = false;

	constructor(
		private fb: FormBuilder,
		private ref: DynamicDialogRef,
		private customerService: CustomerService,
		private notificationService: NotificationService,
		private loadingService: LoadingService,
	) {
		this.form = this.fb.group(
			{
				currentPassword: ["", Validators.required],
				newPassword: ["", [Validators.required, Validators.minLength(8)]],
				confirmPassword: ["", Validators.required],
			},
			{ validators: passwordsMatchValidator },
		);
	}

	get currentPassword() {
		return this.form.get("currentPassword");
	}

	get newPassword() {
		return this.form.get("newPassword");
	}

	get confirmPassword() {
		return this.form.get("confirmPassword");
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const { currentPassword, newPassword } = this.form.getRawValue();

		this.submitting = true;
		this.loadingService.loadingOn();
		this.customerService.changePassword({ currentPassword, newPassword }).subscribe({
			next: () => {
				this.notificationService.showSuccess("Password updated successfully");
				this.ref.close();
			},
			error: (err) => {
				this.notificationService.showError(err?.error?.message || "Failed to update password");
			},
			complete: () => {
				this.submitting = false;
				this.loadingService.loadingOff();
			},
		});
	}

	cancel(): void {
		this.ref.close();
	}
}
