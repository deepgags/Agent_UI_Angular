import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CustomerService } from "../../../services/customer.service";
import { NotificationService } from "../../../services/notification.service";


import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	imports: [ReactiveFormsModule, RouterModule, InputTextModule, PasswordModule],
})
export class LoginComponent {
	loginForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private customerService: CustomerService,
		private router: Router,
		private notificationService: NotificationService
	) {
		this.loginForm = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]],
		});
	}

	login() {
		if (this.loginForm.valid) {
			const { email, password } = this.loginForm.value;
			this.customerService.login({ emailAddress: email, password }).subscribe({
				next: (response: any) => {
					localStorage.setItem("token", response.token);
					this.router.navigate(["/profile"]);
				},
				error: (error: any) => {
					this.notificationService.showSuccess(error.error.message);
				},
			});
		}
	}
}
