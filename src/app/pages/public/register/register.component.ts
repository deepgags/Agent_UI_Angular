import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ImageCropperComponent } from "ngx-smart-cropper";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { SelectModule } from "primeng/select";
import { Pages } from "../../../enums/pages";
import { BrokerageTypeModel } from "../../../models/BrokerageTypeModel";
import { CustomerModel } from "../../../models/CustomerModel";
import { BrokerageTypeService } from "../../../services/brokerage.service";
import { CustomerService } from "../../../services/customer.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";
@Component({
	selector: "app-register",
	imports: [
		CommonModule,
		AngularSvgIconModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		ImageCropperComponent,
		InputMaskModule,
		SelectModule,
		FloatLabelModule,
		InputTextModule,
		PasswordModule,
	],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
})
export class RegisterComponent implements OnInit {
	customerForm!: FormGroup;

	brokerageTypes: BrokerageTypeModel[] = [];

	croppedProfileImage = "";
	profileImageSource: any;
	logoCroppedImage = "";
	logoImageSource: string = "";
	logoImagePath: string = "";
	showSVG: boolean = false;

	onFileChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		const file = input.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				if (input?.id == "profileImageUpload") {
					this.profileImageSource = e.target.result;
				} else {
					this.logoImageSource = e.target.result;
				}
			};
			reader.readAsDataURL(file);
		}
	}

	onProfileImageCrop(event: any) {
		this.croppedProfileImage = event;
	}

	onLogoImageCrop(event: any) {
		this.logoCroppedImage = event;
	}

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private brokerageTypeService: BrokerageTypeService,
		private notificationService: NotificationService,
		private loadingService: LoadingService,
		private titleService: Title,
		private customerService: CustomerService
	) {
		this.titleService.setTitle("Register");
	}

	ngOnInit() {
		this.customerForm = this.fb.group({
			businessName: new FormControl("", Validators.required),
			brokerageType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			cellNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			address: new FormControl(""),
			password: new FormControl("", [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$")]),
			confirmPassword: new FormControl("", Validators.required),
			logoImage: new FormControl(""),
			logoImagePath: new FormControl(""),
			profileImage: new FormControl(""),
			profileImagePath: new FormControl(""),
		});

		this.getBrokerageTypes();
	}

	getBrokerageTypes() {
		this.loadingService.loadingOn();
		this.brokerageTypeService.getBrokerageTypes().subscribe({
			next: (response: any) => {
				this.brokerageTypes = response.data;
			},
			error: () => {
				this.notificationService.showNotification("Error occurred while getting brokerage types");
			},
			complete: () => {
				this.loadingService.loadingOff();
			},
		});
	}

	brokerageChange(selectedBrokerageId: string): void {
		const selectedBrokerage = this.brokerageTypes.filter((brokerage: BrokerageTypeModel) => brokerage._id == selectedBrokerageId)[0];
		this.logoImagePath = selectedBrokerage.logoPath;
	}

	register() {
		if (this.customerForm.valid) {
			const {
				businessName,
				brokerageType,
				firstName,
				lastName,
				phoneNumber,
				cellNumber,
				emailAddress,
				address,
				password,
				confirmPassword,
			} = this.customerForm.value;
			const params: CustomerModel = {
				brokerageTypeId: brokerageType,
				businessName: businessName,
				address: address,
				firstName: firstName,
				lastName: lastName,
				emailAddress: emailAddress,
				phoneNumber: phoneNumber,
				cellNumber: cellNumber,
				password: password,
				confirmPassword: confirmPassword,
				profileImage: this.croppedProfileImage,
				logoImage: this.logoImageSource,
				// logoImagePath: this.logoImagePath,
			};

			this.loadingService.loadingOn();
			this.customerService.register(params).subscribe({
				next: () => {
					this.loadingService.loadingOff();
					this.router.navigate([Pages.VERIFY_EMAIL], { queryParams: { email: emailAddress } });
				},
				error: (error: any) => {
					this.loadingService.loadingOff();
					this.notificationService.showNotification(error.error.message);
				},
			});
		} else {
			this.notificationService.showNotification("One or more required fields are missing or invalid.");
		}
	}

	redirectToLogin() {
		this.router.navigateByUrl("login");
	}
}
