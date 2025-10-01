import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ColorPickerModule } from "primeng/colorpicker";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { EditorModule } from "primeng/editor";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";

import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { BehaviorSubject, Observable } from "rxjs";
import { ImageDialogComponent } from "../../../components/image-dialog/image-dialog.component";

import { ToggleSwitchModule } from "primeng/toggleswitch";
import { BrokerageTypeModel } from "../../../models/BrokerageTypeModel";
import { CustomerModel } from "../../../models/CustomerModel";
import { BrokerageTypeService } from "../../../services/brokerage.service";
import { CustomerService } from "../../../services/customer.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";
@Component({
	selector: "app-settings",
	imports: [
		CommonModule,
		AngularSvgIconModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		InputTextModule,
		SelectModule,
		InputMaskModule,
		ColorPickerModule,
		DynamicDialogModule,
		IftaLabelModule,
		TextareaModule,
		EditorModule,
		ToggleSwitchModule,
	],
	templateUrl: "./settings.component.html",
	styleUrl: "./settings.component.scss",
	providers: [DialogService],
})
export class SettingsComponent {
	agentForm!: FormGroup;
	agentData!: CustomerModel;
	brokerageTypes: BrokerageTypeModel[] = [];

	existingProfileImage = "";

	// brokerageImage: BehaviorSubject<string>;
	// brokerageImageObservable: Observable<string>;

	primaryAgentProfileImage: BehaviorSubject<string>;
	primaryAgentProfileImageObservable: Observable<string>;

	brokerageLogoImage: BehaviorSubject<string>;
	brokerageLogoImageObservable: Observable<string>;

	secondaryAgentProfileImage: BehaviorSubject<string>;
	secondaryAgentProfileImageObservable: Observable<string>;

	readonly dialog = inject(MatDialog);

	constructor(
		private fb: FormBuilder,
		private customerService: CustomerService,
		private brokerageTypeService: BrokerageTypeService,
		private notificationService: NotificationService,
		private loadingService: LoadingService,
		private titleService: Title,
		public dialogService: DialogService
	) {
		this.titleService.setTitle("Profile");

		// this.brokerageImage = new BehaviorSubject("");
		// this.brokerageImageObservable = this.brokerageImage.asObservable();

		this.brokerageLogoImage = new BehaviorSubject("");
		this.brokerageLogoImageObservable = this.brokerageLogoImage.asObservable();

		this.primaryAgentProfileImage = new BehaviorSubject("");
		this.primaryAgentProfileImageObservable = this.primaryAgentProfileImage.asObservable();

		this.secondaryAgentProfileImage = new BehaviorSubject("");
		this.secondaryAgentProfileImageObservable = this.secondaryAgentProfileImage.asObservable();
	}

	get emailAddress() {
		return this.agentForm.get("emailAddress");
	}
	get phoneNumber() {
		return this.agentForm.get("phoneNumber");
	}

	get businessName() {
		return this.agentForm.get("businessName");
	}

	get brokerageType() {
		return this.agentForm.get("brokerageType");
	}

	get firstName() {
		return this.agentForm.get("firstName");
	}

	get lastName() {
		return this.agentForm.get("lastName");
	}

	get siteUrl() {
		return this.agentForm.get("siteUrl");
	}

	ngOnInit() {
		this.agentForm = this.fb.group({
			businessName: new FormControl("", Validators.required),
			brokerageType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			designation: new FormControl(""),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			address: new FormControl(""),
			logoImage: new FormControl(""),
			logoImagePath: new FormControl(""),
			profileImage: new FormControl(""),
			profileImagePath: new FormControl(""),
			siteUrl: new FormControl("", [
				Validators.required,
				// Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"),
			]),
			// Website Settings Form Controls
			primaryColor: new FormControl(""),
			secondaryColor: new FormControl(""),
			facebook: new FormControl(""),
			twitter: new FormControl(""),
			instagram: new FormControl(""),
			linkedin: new FormControl(""),
			youtube: new FormControl(""),
			websiteEmail: new FormControl(""),
			websitePhone: new FormControl(""),
			secondaryAgent: this.fb.group({
				enableSecondaryAgent: new FormControl(false),
				firstName: new FormControl(""),
				lastName: new FormControl(""),
				websitePhone: new FormControl(""),
				websiteEmail: new FormControl(""),
				profileImage: new FormControl(""),
				designation: new FormControl(""),
			}),
		});

		this.getBrokerageTypes();
	}

	getProfile() {
		this.customerService.getCustomer().subscribe({
			next: (response: any) => {
				if (response.status) {
					this.agentData = response.data;
					const { businessName, firstName, lastName, emailAddress, phoneNumber, brokerageTypeId, websiteSettings, brokerage } =
						response.data;

					const {
						primaryColor,
						secondaryColor,
						logoImage,
						contactInfo: { address: websiteAddress, email: websiteEmail, phone: websitePhone },
						socialLinks: { facebook, instagram, linkedin, twitter, youtube },
						profileImage,
						siteUrl,
					} = websiteSettings;

					this.existingProfileImage = profileImage;
					// this.brokerageImage.next(brokerage.logoPath);
					this.primaryAgentProfileImage.next(profileImage);
					this.brokerageLogoImage.next(logoImage);

					this.agentForm.patchValue({
						businessName: businessName,
						firstName: firstName,
						lastName: lastName,
						// address: websiteAddress,
						emailAddress: emailAddress,
						phoneNumber: phoneNumber,
						brokerageType: brokerageTypeId,
						siteUrl: siteUrl,
					});

					if (response.data.websiteSettings) {
						this.agentForm.patchValue({
							primaryColor: primaryColor,
							secondaryColor: secondaryColor,
							facebook: facebook,
							twitter: twitter,
							instagram: instagram,
							linkedin: linkedin,
							youtube: youtube,
							websiteEmail: websiteEmail,
							websitePhone: websitePhone,
						});
						if (response.data.secondaryAgent) {
							this.agentForm.get("secondaryAgent")?.patchValue({
								...response.data.secondaryAgent,
							});
							this.secondaryAgentProfileImage.next(response.data.secondaryAgent.profileImage);
						}
					}

					this.emailAddress?.disable();
					this.phoneNumber?.disable();
				}
			},
			error: () => {
				this.notificationService.showSuccess("An error has occurred while getting customer information");
			},
			complete: () => {},
		});
	}

	getBrokerageTypes() {
		this.loadingService.loadingOn();
		this.brokerageTypeService.getBrokerageTypes().subscribe({
			next: (response: any) => {
				this.brokerageTypes = response.data;
				this.getProfile();
			},
			error: () => {
				this.notificationService.showSuccess("Error occurred while getting brokerage types");
			},
			complete: () => {
				this.loadingService.loadingOff();
			},
		});
	}

	// brokerageChange(selectedBrokerage: any): void {
	// 	for (const brokerage of this.brokerageTypes) {
	// 		if (brokerage._id === selectedBrokerage) {
	// 			this.brokerageImage.next(brokerage.logoPath);
	// 			break;
	// 		}
	// 	}
	// }

	save() {
		const { valid } = this.agentForm;
		if (valid) {
			// this.profileImage = this.profileImageSource ?? "";
			// this.logoImage = this.logoImageSource ?? "";
			// this.agentData.logoImagePath = this.logoImagePath;
			this.loadingService.loadingOn();
			const {
				businessName,
				firstName,
				lastName,
				address,
				brokerageType,
				siteUrl,
				primaryColor,
				secondaryColor,
				facebook,
				twitter,
				instagram,
				linkedin,
				youtube,
				websiteEmail,
				websitePhone,
				// websiteAddress,
			} = this.agentForm.getRawValue();

			const params = {
				businessName: businessName,
				firstName: firstName,
				lastName: lastName,
				address: address,
				brokerageTypeId: brokerageType,
				websiteSettings: {
					siteUrl: siteUrl,
					primaryColor,
					secondaryColor,
					socialLinks: {
						facebook,
						twitter,
						instagram,
						linkedin,
						youtube,
					},
					contactInfo: {
						email: websiteEmail,
						phone: websitePhone,
					},
					profileImage: this.primaryAgentProfileImage.value ? this.primaryAgentProfileImage.value : this.existingProfileImage,
					brokerageImage: this.brokerageLogoImage.value,
					// logoImage: this.brokerageLogoImage.value,
				},
				secondaryAgent: {
					...this.agentForm.value.secondaryAgent,
					profileImage: this.secondaryAgentProfileImage.value,
				},
			};
			// console.log(params);
			// return;
			this.customerService.update(params).subscribe({
				next: (v) => {},
				error: (e) => {
					this.notificationService.showSuccess(e.error.message || "Something went wrong while updating information.");
				},
				complete: () => {
					this.notificationService.showSuccess("Profile updated successfully");
					this.loadingService.loadingOff();
				},
			});
		} else {
			this.agentForm.markAllAsTouched();
			this.notificationService.showSuccess("One or more required fields are missing or invalid.");
		}
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
			this.primaryAgentProfileImage.next(croppedImage);
		});
	}

	onBrokerageLogoImageChange(event: Event): void {
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Logo Image",
			height: "80%",
			width: "80%",
			closable: false,
			closeOnEscape: false,
			data: {
				imageChangedEvent: event,
			},
		});
		ref.onClose.subscribe((croppedImage: string) => {
			if (croppedImage) {
				this.brokerageLogoImage.next(croppedImage);
			}
		});
	}

	onSecondaryProfileImageChange(event: Event): void {
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
			if (croppedImage) {
				this.secondaryAgentProfileImage.next(croppedImage);
			}
		});
	}
}
