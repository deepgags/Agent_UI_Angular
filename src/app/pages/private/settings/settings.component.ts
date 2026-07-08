import { CommonModule } from "@angular/common";
import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

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
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { ImageDialogComponent } from "../../../components/image-dialog/image-dialog.component";
import { BlobToUrlPipe } from "../../../pipes/blob-to-url";

import { AutoCompleteModule } from "primeng/autocomplete";
import { CheckboxModule } from "primeng/checkbox";
import { ToggleSwitchModule } from "primeng/toggleswitch";

import { environment } from "../../../environments/environment.development";
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
		CheckboxModule,
		BlobToUrlPipe,
	],
	templateUrl: "./settings.component.html",
	styleUrl: "./settings.component.scss",
	providers: [DialogService],
})
export class SettingsComponent {
	_fileSizeLimit = 2097152; //2MB
	@ViewChild("brokerageLogoUpload", { static: false }) brokerageLogoUpload!: ElementRef<HTMLInputElement>;
	@ViewChild("personalBrandingLogoUpload", { static: false }) personalBrandingLogoUpload!: ElementRef<HTMLInputElement>;

	agentForm!: FormGroup;
	agentData!: CustomerModel;
	brokerageTypes: string[] = [];
	_brokerageTypesCopy: string[] = [];

	existingProfileImage = "";
	existingSecondaryProfileImage = "";
	existingBrokerageImage = "";
	existingPersonalBrandingLogo = "";
	removeExistingPersonalBrandingLogo = false;
	primaryAgentProfileImage: BehaviorSubject<Blob | null>;
	primaryAgentProfileImageObservable: Observable<Blob | null>;

	brokerageLogoImage: BehaviorSubject<Blob | null>;
	brokerageLogoImageObservable: Observable<Blob | null>;

	personalBrandingLogoImage: BehaviorSubject<Blob | null>;
	personalBrandingLogoImageObservable: Observable<Blob | null>;

	secondaryAgentProfileImage: BehaviorSubject<Blob | null>;
	secondaryAgentProfileImageObservable: Observable<Blob | null>;

	localImageBaseUrl = environment.localImageUrl;

	constructor(
		private fb: FormBuilder,
		private customerService: CustomerService,
		private brokerageTypeService: BrokerageTypeService,
		private notificationService: NotificationService,
		private loadingService: LoadingService,
		private titleService: Title,
		public dialogService: DialogService,
	) {
		this.titleService.setTitle("Profile");

		// this.brokerageImage = new BehaviorSubject("");
		// this.brokerageImageObservable = this.brokerageImage.asObservable();

		this.brokerageLogoImage = new BehaviorSubject<Blob | null>(null);
		this.brokerageLogoImageObservable = this.brokerageLogoImage.asObservable();

		this.personalBrandingLogoImage = new BehaviorSubject<Blob | null>(null);
		this.personalBrandingLogoImageObservable = this.personalBrandingLogoImage.asObservable();

		this.primaryAgentProfileImage = new BehaviorSubject<Blob | null>(null);
		this.primaryAgentProfileImageObservable = this.primaryAgentProfileImage.asObservable();

		this.secondaryAgentProfileImage = new BehaviorSubject<Blob | null>(null);
		this.secondaryAgentProfileImageObservable = this.secondaryAgentProfileImage.asObservable();
	}

	ngOnInit() {
		this.agentForm = this.fb.group({
			businessName: new FormControl("", Validators.required),
			subheading: new FormControl(""),
			brokerageType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl(""),
			phoneNumber: new FormControl("", [Validators.required]),
			designation: new FormControl("", [Validators.required]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			// address: new FormControl("", [Validators.required]),
			streetAddress: new FormControl("", [Validators.required]),
			municipality: new FormControl("", [Validators.required]),
			province: new FormControl("", [Validators.required]),
			postalCode: new FormControl("", [Validators.required]),
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
			websiteEmail: new FormControl("", [Validators.required, Validators.email]),
			websitePhone: new FormControl("", [Validators.required]),
			secondaryAgent: this.fb.group({
				enableSecondaryAgent: new FormControl(false),
				firstName: new FormControl(""),
				lastName: new FormControl(""),
				websitePhone: new FormControl(""),
				websiteEmail: new FormControl("", [Validators.email]),
				profileImage: new FormControl(""),
				designation: new FormControl(""),
			}),
			showHomeWorthPage: new FormControl(false),
			showSellingInNeighborHoodPage: new FormControl(false),
			showFindDreamHomePage: new FormControl(false),
			secondaryAgentFirst: new FormControl(false),
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

	get subheading() {
		return this.agentForm.get("subheading");
	}

	get brokerageType() {
		return this.agentForm.get("brokerageType");
	}

	get firstName() {
		return this.agentForm.get("firstName");
	}

	// get address() {
	// 	return this.agentForm.get("address");
	// }

	get streetAddress() {
		return this.agentForm.get("streetAddress");
	}

	get municipality() {
		return this.agentForm.get("municipality");
	}

	get province() {
		return this.agentForm.get("province");
	}

	get postalCode() {
		return this.agentForm.get("postalCode");
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
						brokerage,
						designation,
						subheading,
					} = response.data;
					const websiteSettings = response.data.websiteSettings ?? {};

					const contactInfo = websiteSettings?.contactInfo ?? {};
					const socialLinks = websiteSettings?.socialLinks ?? {};
					const {
						primaryColor,
						secondaryColor,
						brokerageImage,
						profileImage,
						personalBrandingLogo,
						siteUrl,
						showHomeWorthPage,
						showSellingInNeighborHoodPage,
						showFindDreamHomePage,
						secondaryAgentFirst,
					} = websiteSettings;
					const {
						// address,
						streetAddress,
						municipality,
						province,
						postalCode,
						email: websiteEmail,
						phone: websitePhone,
					} = contactInfo;
					const { facebook, instagram, linkedin, twitter, youtube } = socialLinks;

					this.existingProfileImage = profileImage;
					this.existingBrokerageImage = brokerageImage;
					this.existingPersonalBrandingLogo = personalBrandingLogo;
					// this.brokerageImage.next(brokerage.logoPath);

					this.agentForm.patchValue({
						businessName: businessName,
						subheading: subheading,
						firstName: firstName,
						lastName: lastName,
						// address: address,
						streetAddress: streetAddress,
						municipality: municipality,
						province: province,
						postalCode: postalCode,
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
							showHomeWorthPage: showHomeWorthPage ?? false,
							showSellingInNeighborHoodPage: showSellingInNeighborHoodPage ?? false,
							showFindDreamHomePage: showFindDreamHomePage ?? false,
							secondaryAgentFirst: secondaryAgentFirst ?? false,
						});
						if (response.data.secondaryAgent) {
							this.agentForm.get("secondaryAgent")?.patchValue({
								...response.data.secondaryAgent,
							});
							this.existingSecondaryProfileImage = response.data.secondaryAgent.profileImage;
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
				this.notificationService.showError("An error has occurred while getting customer information");
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
				this.notificationService.showError("Error occurred while getting brokerage types");
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
			this.loadingService.loadingOn();
			const {
				businessName,
				subheading,
				firstName,
				lastName,
				// address,
				streetAddress,
				municipality,
				province,
				postalCode,
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

			const formData = new FormData();
			formData.append("businessName", businessName);
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			// formData.append("address", address);
			formData.append("streetAddress", streetAddress);
			formData.append("municipality", municipality);
			formData.append("province", province);
			formData.append("postalCode", postalCode);
			formData.append("brokerageTypeId", brokerageType);
			if (designation) formData.append("designation", designation);
			if (subheading) formData.append("subheading", subheading);

			// Website settings
			if (primaryColor) formData.append("primaryColor", primaryColor);
			if (secondaryColor) formData.append("secondaryColor", secondaryColor);
			if (websiteEmail) formData.append("websiteEmail", websiteEmail);
			if (websitePhone) formData.append("websitePhone", websitePhone);

			// Images
			if (this.primaryAgentProfileImage.value) {
				formData.append("profileImage", this.primaryAgentProfileImage.value, "profile-image.png");
			} else if (this.existingProfileImage) {
				formData.append("existingProfileImage", this.existingProfileImage);
			}

			if (this.brokerageLogoImage.value) {
				formData.append("brokerageImage", this.brokerageLogoImage.value, "brokerage-logo.png");
			}

			if (this.personalBrandingLogoImage.value) {
				formData.append("personalBrandingLogo", this.personalBrandingLogoImage.value, "personal-branding-logo.png");
			} else if (this.removeExistingPersonalBrandingLogo) {
				formData.append("removePersonalBrandingLogo", "true");
			} else if (this.existingPersonalBrandingLogo) {
				formData.append("existingPersonalBrandingLogo", this.existingPersonalBrandingLogo);
			}

			// social links
			const socialLinks: any = {};
			if (facebook) {
				socialLinks.facebook = facebook;
			}
			if (twitter) {
				socialLinks.twitter = twitter;
			}
			if (instagram) {
				socialLinks.instagram = instagram;
			}
			if (linkedin) {
				socialLinks.linkedin = linkedin;
			}
			if (youtube) {
				socialLinks.youtube = youtube;
			}
			formData.append("socialLinks", JSON.stringify(socialLinks));

			// Secondary agent
			const secondaryAgent = this.agentForm.value.secondaryAgent;
			formData.append("secondaryAgent", JSON.stringify(secondaryAgent));
			if (this.secondaryAgentProfileImage.value) {
				formData.append(
					"secondaryAgentProfileImage",
					this.secondaryAgentProfileImage.value,
					"secondary-profile.png",
				);
			} else if (this.existingSecondaryProfileImage) {
				formData.append("existingSecondaryProfileImage", this.existingSecondaryProfileImage);
			}

			const { showHomeWorthPage, showSellingInNeighborHoodPage, showFindDreamHomePage, secondaryAgentFirst } =
				this.agentForm.value;
			const pageParams = {
				websiteSettings: {
					showHomeWorthPage,
					showSellingInNeighborHoodPage,
					showFindDreamHomePage,
					secondaryAgentFirst,
				},
			};

			forkJoin({
				profile: this.customerService.update(formData),
				pages: this.customerService.updatePageContent(pageParams),
			}).subscribe({
				next: () => {},
				error: (e) => {
					this.notificationService.showError(
						e.error?.message || "Something went wrong while updating information.",
					);
					this.loadingService.loadingOff();
				},
				complete: () => {
					this.notificationService.showSuccess("Settings updated successfully");
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
		ref?.onClose.subscribe((croppedImage: Blob | null) => {
			if (croppedImage) {
				this.primaryAgentProfileImage.next(croppedImage);
			} else {
				this.primaryAgentProfileImage.next(null);
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
		ref?.onClose.subscribe((croppedImage: Blob | null) => {
			if (croppedImage) {
				this.brokerageLogoImage.next(croppedImage);
			} else {
				this.brokerageLogoImage.next(null);
			}
		});
	}

	removeBrokerageLogoImage(): void {
		this.brokerageLogoImage.next(null);
		if (this.brokerageLogoUpload) {
			this.brokerageLogoUpload.nativeElement.value = "";
		}
	}

	onPersonalBrandingLogoChange(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.size > this._fileSizeLimit) {
			this.notificationService.showError("File size must be less than 2MB");
			return;
		}
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Personal Branding Logo",
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
		ref?.onClose.subscribe((croppedImage: Blob | null) => {
			if (croppedImage) {
				this.personalBrandingLogoImage.next(croppedImage);
			} else {
				this.personalBrandingLogoImage.next(null);
			}
		});
	}

	removePersonalBrandingLogo(): void {
		this.personalBrandingLogoImage.next(null);
		if (this.existingPersonalBrandingLogo) {
			this.removeExistingPersonalBrandingLogo = true;
		}
		if (this.personalBrandingLogoUpload) {
			this.personalBrandingLogoUpload.nativeElement.value = "";
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
		ref?.onClose.subscribe((croppedImage: Blob | null) => {
			if (croppedImage) {
				this.secondaryAgentProfileImage.next(croppedImage);
			} else {
				this.secondaryAgentProfileImage.next(null);
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
