import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { TabsModule } from "primeng/tabs";
import { CustomerService } from "../../services/customer.service";
import { NotificationService } from "../../services/notification.service";
import { SharedDataService } from "../../services/shareddata.service";

@Component({
	selector: "app-user-login-dialog",
	imports: [CommonModule, ReactiveFormsModule, TabsModule, InputTextModule, PasswordModule, RouterModule],
	templateUrl: "./user-login-dialog.component.html",
	styleUrl: "./user-login-dialog.component.scss",
})
export class UserLoginDialogComponent {
	activeTab = 0;

	loginForm: FormGroup;
	registerForm: FormGroup;
	forgetPasswordForm: FormGroup;

	constructor(
		private customerService: CustomerService,
		private notificationService: NotificationService,
		private sharedDataService: SharedDataService
	) {
		this.loginForm = new FormGroup({
			email: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [Validators.required]),
		});

		this.registerForm = new FormGroup({
			name: new FormControl("", [Validators.required]),
			email: new FormControl("", [Validators.required, Validators.email]),
			phone: new FormControl("", [Validators.required]),
			password: new FormControl("", [Validators.required]),
		});

		this.forgetPasswordForm = new FormGroup({
			email: new FormControl("", [Validators.required, Validators.email]),
		});
	}

	login() {
		if (this.loginForm.valid) {
			const { email, password } = this.loginForm.value;
			this.customerService.loginUser({ email, password }).subscribe({
				next: (response: any) => {
					localStorage.setItem("user_token", response.token);
				},
				error: (error: any) => {
					this.notificationService.showError(error.error.message);
				},
			});
		}
	}

	get loginEmail() {
		return this.loginForm.get("email");
	}
	get loginPassword() {
		return this.loginForm.get("password");
	}
	get registerName() {
		return this.registerForm.get("name");
	}
	get registerEmail() {
		return this.registerForm.get("email");
	}
	get registerPhone() {
		return this.registerForm.get("phone");
	}
	get registerPassword() {
		return this.registerForm.get("password");
	}
	get forgetPasswordEmail() {
		return this.forgetPasswordForm.get("email");
	}

	register() {
		if (this.registerForm.valid) {
			const { name, email, phone, password } = this.registerForm.value;
			this.customerService
				.registerUser({
					name,
					email,
					password,
					mobile: +phone,
					siteId: this.sharedDataService.siteId(),
				})
				.subscribe({
					next: (response: any) => {
						this.notificationService.showSuccess("Registration successful!");
					},
					error: (error: any) => {
						this.notificationService.showError(error.error.message);
					},
				});
		}
	}

	switchToLogin() {
		this.activeTab = 0;
	}

	switchToRegister() {
		this.activeTab = 1;
	}

	forgetPassword() {
		if (this.forgetPasswordForm.valid) {
			const { email } = this.forgetPasswordForm.value;
			this.customerService.forgetPasswordUser({ email }).subscribe({
				next: (response: any) => {
					this.notificationService.showSuccess("Password reset instructions sent to your email!");
					this.switchToLogin();
				},
				error: (error: any) => {
					this.notificationService.showError(error.error.message);
				},
			});
		}
	}

	switchToForgetPassword() {
		this.activeTab = 2;
	}
}
