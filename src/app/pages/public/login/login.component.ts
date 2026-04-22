import { Component, DOCUMENT, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CustomerService } from "../../../services/customer.service";
// import { NotificationService } from "../../../services/notification.service";

import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { Pages } from "../../../enums/pages";
import { NotificationService } from "../../../services/notification.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	imports: [ReactiveFormsModule, RouterModule, InputTextModule, PasswordModule],
	standalone: true,
})
export class LoginComponent {
	loginForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private customerService: CustomerService,
		private router: Router,
		private notificationService: NotificationService,
		@Inject(DOCUMENT) private document: Document,
	) {
		this.loginForm = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]],
		});
	}

	login() {
		if (this.loginForm.valid) {
			const { email, password } = this.loginForm.value;
			const hostname = this.document.location.hostname;
			this.customerService.login({ emailAddress: email, password, domain: hostname }).subscribe({
				next: (response: any) => {
					localStorage.setItem("token", response.token);
					this.router.navigate([Pages.SETTINGS]);
				},
				error: (error: any) => {
					this.notificationService.showError(error.error.message);
				},
			});
		}
	}
}
