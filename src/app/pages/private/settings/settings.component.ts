import { CommonModule } from "@angular/common";
import { Component, ElementRef, inject, ViewChild } from "@angular/core";
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

import { AutoCompleteModule } from "primeng/autocomplete";
import { ToggleSwitchModule } from "primeng/toggleswitch";

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
		AutoCompleteModule,
	],
	templateUrl: "./settings.component.html",
	styleUrl: "./settings.component.scss",
	providers: [DialogService],
})
export class SettingsComponent {
	_fileSizeLimit = 2097152; //2MB
	@ViewChild("brokerageLogoUpload", { static: false }) brokerageLogoUpload!: ElementRef<HTMLInputElement>;

	agentForm!: FormGroup;
	agentData!: CustomerModel;
	brokerageTypes: string[] = [];
	_brokerageTypesCopy: string[] = [];

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

	ngOnInit() {
		this.agentForm = this.fb.group({
			businessName: new FormControl("", Validators.required),
			brokerageType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl(""),
			phoneNumber: new FormControl("", [Validators.required]),
			designation: new FormControl("", [Validators.required]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			address: new FormControl(""),
			logoImage: new FormControl(""),
			logoImagePath: new FormControl(""),
			profileImage: new FormControl(""),
			profileImagePath: new FormControl(""),
			siteUrl: new FormControl({ value: "", disabled: true }, [
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
			websitePhone: new FormControl("", [Validators.required]),
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

	get emailAddress() {
		return this.agentForm.get("emailAddress");
	}
	get phoneNumber() {
		return this.agentForm.get("phoneNumber");
	}

	get designation() {
		return this.agentForm.get("designation");
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

	// get lastName() {
	// 	return this.agentForm.get("lastName");
	// }

	get siteUrl() {
		return this.agentForm.get("siteUrl");
	}

	get websiteEmail() {
		return this.agentForm.get("websiteEmail");
	}

	get websitePhone() {
		return this.agentForm.get("websitePhone");
	}

	getProfile() {
		this.customerService.getCustomer().subscribe({
			next: (response: any) => {
				if (response.status) {
					this.agentData = response.data;
					const {
						businessName,
						firstName,
						lastName,
						emailAddress,
						phoneNumber,
						brokerageTypeId,
						websiteSettings,
						brokerage,
						designation,
					} = response.data;

					const {
						primaryColor,
						secondaryColor,
						brokerageImage,
						contactInfo: { address, email: websiteEmail, phone: websitePhone },
						socialLinks: { facebook, instagram, linkedin, twitter, youtube },
						profileImage,
						siteUrl,
					} = websiteSettings;

					this.existingProfileImage = profileImage;
					// this.brokerageImage.next(brokerage.logoPath);
					this.primaryAgentProfileImage.next(profileImage);
					this.brokerageLogoImage.next(brokerageImage);

					this.agentForm.patchValue({
						businessName: businessName,
						firstName: firstName,
						lastName: lastName,
						address: address,
						emailAddress: emailAddress,
						phoneNumber: phoneNumber,
						brokerageType: brokerageTypeId,
						siteUrl: siteUrl,
						designation: designation,
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
					this.setSecondaryAgentValidations({
						checked: this.agentForm.get("secondaryAgent.enableSecondaryAgent")?.value,
					});
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
				this._brokerageTypesCopy = response.data;
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
		console.log(this.agentForm.controls);
		if (this.agentForm.valid) {
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
				// siteUrl,
				primaryColor,
				secondaryColor,
				facebook,
				twitter,
				instagram,
				linkedin,
				youtube,
				websiteEmail,
				websitePhone,
				designation,
				// websiteAddress,
			} = this.agentForm.getRawValue();

			const params = {
				businessName: businessName,
				firstName: firstName,
				lastName: lastName,

				brokerageTypeId: brokerageType,
				designation,
				websiteSettings: {
					// siteUrl: siteUrl,
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
						address: address,
					},
					profileImage: this.primaryAgentProfileImage.value
						? this.primaryAgentProfileImage.value
						: this.existingProfileImage,
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
					this.notificationService.showError(
						e.error.message || "Something went wrong while updating information."
					);
				},
				complete: () => {
					this.notificationService.showSuccess("Profile updated successfully");
					this.loadingService.loadingOff();
				},
			});
		} else {
			this.agentForm.markAllAsTouched();
			this.notificationService.showError("One or more required fields are missing or invalid.");
		}
	}

	onProfileImageChange(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.size > this._fileSizeLimit) {
			this.notificationService.showError("File size must be less than 2MB");
			return;
		}
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Profile Image",
			height: "80%",
			width: "80%",
			closable: true,
			closeOnEscape: true,
			modal: true,
			focusOnShow: false,
			data: {
				imageChangedEvent: event,
			},
		});
		ref.onClose.subscribe((croppedImage: string) => {
			if (croppedImage) {
				this.primaryAgentProfileImage.next(croppedImage);
			} else {
				this.primaryAgentProfileImage.next("");
			}
		});
	}

	onBrokerageLogoImageChange(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.size > this._fileSizeLimit) {
			this.notificationService.showError("File size must be less than 2MB");
			return;
		}
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Logo Image",
			height: "80%",
			width: "80%",
			closable: true,
			closeOnEscape: true,
			modal: true,
			focusOnShow: false,
			data: {
				imageChangedEvent: event,
				freeSelection: true,
			},
		});
		ref.onClose.subscribe((croppedImage: string) => {
			if (croppedImage) {
				this.brokerageLogoImage.next(croppedImage);
			} else {
				this.brokerageLogoImage.next("");
			}
		});
	}

	removeBrokerageLogoImage(): void {
		this.brokerageLogoImage.next("");
		if (this.brokerageLogoUpload) {
			this.brokerageLogoUpload.nativeElement.value = "";
		}
	}

	onSecondaryProfileImageChange(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.size > this._fileSizeLimit) {
			this.notificationService.showError("File size must be less than 2MB");
			return;
		}
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Profile Image",
			height: "80%",
			width: "80%",
			closable: true,
			closeOnEscape: true,
			modal: true,
			focusOnShow: false,
			data: {
				imageChangedEvent: event,
			},
		});
		ref.onClose.subscribe((croppedImage: string) => {
			if (croppedImage) {
				this.secondaryAgentProfileImage.next(croppedImage);
			} else {
				this.secondaryAgentProfileImage.next("");
			}
		});
	}

	searchBrokerage = (event: any) => {
		this.brokerageTypes = this._brokerageTypesCopy.filter((item) => {
			return item.toLowerCase().indexOf(event.query.toLowerCase()) > -1;
		});
	};

	setSecondaryAgentValidations(e: any) {
		const isEnabled = e.checked;
		const secondaryAgentForm = this.agentForm.get("secondaryAgent") as FormGroup;
		const firstName = secondaryAgentForm.get("firstName");
		const websiteEmail = secondaryAgentForm.get("websiteEmail");
		const websitePhone = secondaryAgentForm.get("websitePhone");
		const designation = secondaryAgentForm.get("designation");

		if (isEnabled) {
			firstName?.setValidators([Validators.required]);
			websiteEmail?.setValidators([Validators.required, Validators.email]);
			websitePhone?.setValidators([Validators.required]);
			designation?.setValidators([Validators.required]);
		} else {
			firstName?.clearValidators();
			websiteEmail?.clearValidators();
			websitePhone?.clearValidators();
			designation?.clearValidators();
		}

		firstName?.updateValueAndValidity();
		websiteEmail?.updateValueAndValidity();
		websitePhone?.updateValueAndValidity();
		designation?.updateValueAndValidity();
	}
}
