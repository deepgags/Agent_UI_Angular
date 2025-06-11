import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DialogService } from "primeng/dynamicdialog";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { SelectModule } from "primeng/select";
import { BehaviorSubject, Observable } from "rxjs";
import { ImageDialogComponent } from "../../../components/image-dialog/image-dialog.component";
import { Pages } from "../../../enums/pages";
import { BrokerageTypeModel } from "../../../models/BrokerageTypeModel";
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
		InputMaskModule,
		SelectModule,
		InputTextModule,
		PasswordModule,
	],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
	providers: [DialogService],
})
export class RegisterComponent implements OnInit {
	customerForm!: FormGroup;

	brokerageTypes: BrokerageTypeModel[] = [];

	newSelectedProfileImage: BehaviorSubject<string>;
	newSelectedProfileImageObservable: Observable<string>;
	newSelectedLogoImage: string = "";

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private brokerageTypeService: BrokerageTypeService,
		private notificationService: NotificationService,
		private loadingService: LoadingService,
		private titleService: Title,
		private customerService: CustomerService,
		public dialogService: DialogService
	) {
		this.titleService.setTitle("Register");
		this.newSelectedProfileImage = new BehaviorSubject("");
		this.newSelectedProfileImageObservable = this.newSelectedProfileImage.asObservable();
	}

	get brokerageType() {
		return this.customerForm.get("brokerageType");
	}

	get businessName() {
		return this.customerForm.get("businessName");
	}

	get firstName() {
		return this.customerForm.get("firstName");
	}

	get lastName() {
		return this.customerForm.get("lastName");
	}

	get phoneNumber() {
		return this.customerForm.get("phoneNumber");
	}

	get emailAddress() {
		return this.customerForm.get("emailAddress");
	}

	get password() {
		return this.customerForm.get("password");
	}

	get confirmPassword() {
		return this.customerForm.get("confirmPassword");
	}

	ngOnInit() {
		this.customerForm = this.fb.group({
			businessName: new FormControl("", Validators.required),
			brokerageType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			// cellNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			address: new FormControl(""),
			password: new FormControl("", [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$")]),
			confirmPassword: new FormControl("", Validators.required),
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
		this.newSelectedLogoImage = selectedBrokerage.logoPath;
	}

	onProfileImageChange(event: Event): void {
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Profile Image",
			height: "80%",
			width: "80%",
			closable: false,
			closeOnEscape: false,
			focusOnShow: false,
			data: {
				imageChangedEvent: event,
			},
		});
		ref.onClose.subscribe((croppedImage: string) => {
			this.newSelectedProfileImage.next(croppedImage);
		});
	}

	// onLogoImageChange(event: Event): void {
	// 	const ref = this.dialogService.open(ImageDialogComponent, {
	// 		header: "Adjust Logo Image",
	// 		height: "80%",
	// 		width: "80%",
	// 		closable: false,
	// 		closeOnEscape: false,
	// 		focusOnShow: false,
	// 		data: {
	// 			imageChangedEvent: event,
	// 		},
	// 	});
	// 	ref.onClose.subscribe((croppedImage: string) => {
	// 		this.newSelectedLogoImage = croppedImage;
	// 	});
	// }

	register() {
		if (this.customerForm.valid) {
			const {
				businessName,
				brokerageType,
				firstName,
				lastName,
				phoneNumber,
				// cellNumber,
				emailAddress,
				address,
				password,
				confirmPassword,
			} = this.customerForm.value;
			const params: any = {
				brokerageTypeId: brokerageType,
				businessName: businessName,
				address: address,
				firstName: firstName,
				lastName: lastName,
				emailAddress: emailAddress,
				phoneNumber: phoneNumber,
				// cellNumber: cellNumber,
				password: password,
				confirmPassword: confirmPassword,
				profileImage: this.newSelectedProfileImage,
				logoImage: this.newSelectedLogoImage,
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
			this.customerForm.markAllAsTouched();
			this.notificationService.showNotification("One or more required fields are missing or invalid.");
		}
	}

	redirectToLogin() {
		this.router.navigateByUrl("login");
	}
}
