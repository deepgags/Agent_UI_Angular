import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, NgZone } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MenuItem } from "primeng/api";
import { ColorPickerModule } from "primeng/colorpicker";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { SelectModule } from "primeng/select";
import { ImageDialogComponent } from "../../../components/image-dialog/image-dialog.component";
import { TemplateSelectionDialogComponent } from "../../../components/template-selection-dialog/template-selection-dialog.component";
import { BrokerageTypeModel } from "../../../models/BrokerageTypeModel";
import { CustomerModel } from "../../../models/CustomerModel";
import { TemplateModel } from "../../../models/TemplateModel";
import { BrokerageTypeService } from "../../../services/brokerage.service";
import { CustomerService } from "../../../services/customer.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";
import { TemplateService } from "../../../services/template.service";

@Component({
	selector: "app-profile",
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
		MenuModule,
		DynamicDialogModule,
	],
	templateUrl: "./profile.component.html",
	styleUrl: "./profile.component.scss",
	providers: [DialogService],
})
export class ProfileComponent {
	agentForm!: FormGroup;
	agentData!: CustomerModel;
	brokerageTypes: BrokerageTypeModel[] = [];
	templates: any[] = [];

	existingProfileImage = "";
	existingLogoImage = "";

	newSelectedProfileImage: any;
	newSelectedLogoImage: string = "";

	readonly dialog = inject(MatDialog);
	items: MenuItem[] | undefined;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private customerService: CustomerService,
		private brokerageTypeService: BrokerageTypeService,
		private notificationService: NotificationService,
		private loadingService: LoadingService,
		private titleService: Title,
		private templateService: TemplateService,
		public dialogService: DialogService,
		private cdRef: ChangeDetectorRef,
		private zone: NgZone
	) {
		this.titleService.setTitle("Profile");
		this.items = [
			{
				label: "Settings",
				items: [
					{
						label: "Change Password",
						icon: "fas fa-key",
						routerLink: "/change-password",
					},
					{
						label: "Log Out",
						icon: "fas fa-power-off",
						command: () => {
							this.logout();
						},
					},
				],
			},
		];
	}

	get emailAddress() {
		return this.agentForm.get("emailAddress");
	}
	get phoneNumber() {
		return this.agentForm.get("phoneNumber");
	}
	// get cellNumber() {
	// 	return this.agentForm.get("cellNumber");
	// }

	ngOnInit() {
		this.agentForm = this.fb.group({
			businessName: new FormControl("", Validators.required),
			brokerageType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			phoneNumber: new FormControl(""), //, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
			// cellNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			address: new FormControl(""),
			logoImage: new FormControl(""),
			logoImagePath: new FormControl(""),
			profileImage: new FormControl(""),
			profileImagePath: new FormControl(""),
			siteUrl: new FormControl(""),
			// Website Settings Form Controls
			templateId: new FormControl(""),
			primaryColor: new FormControl(""),
			secondaryColor: new FormControl(""),
			logoUrl: new FormControl(""),
			facebook: new FormControl(""),
			twitter: new FormControl(""),
			instagram: new FormControl(""),
			linkedin: new FormControl(""),
			youtube: new FormControl(""),
			websiteEmail: new FormControl(""),
			websitePhone: new FormControl(""),
			websiteAddress: new FormControl(""),
		});

		this.getBrokerageTypes();
		this.getTemplates();
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
						cellNumber,
						brokerageTypeId,
						websiteSettings,
						brokerage,
					} = response.data;

					const {
						templateId,
						primaryColor,
						secondaryColor,
						logoUrl,
						contactInfo: { address: websiteAddress, email: websiteEmail, phone: websitePhone },
						socialLinks: { facebook, instagram, linkedin, twitter, youtube },
						profileImage,
						siteUrl,
					} = websiteSettings;
					this.existingProfileImage = profileImage;
					this.existingLogoImage = brokerage.logoPath;

					this.agentForm.patchValue({
						businessName: businessName,
						firstName: firstName,
						lastName: lastName,
						address: websiteAddress,
						emailAddress: emailAddress,
						phoneNumber: phoneNumber,
						// cellNumber: cellNumber,
						brokerageType: brokerageTypeId,
						siteUrl: siteUrl,
					});

					if (response.data.websiteSettings) {
						this.agentForm.patchValue({
							templateId: templateId,
							primaryColor: primaryColor,
							secondaryColor: secondaryColor,
							logoUrl: logoUrl,
							facebook: facebook,
							twitter: twitter,
							instagram: instagram,
							linkedin: linkedin,
							youtube: youtube,
							websiteEmail: websiteEmail,
							websitePhone: websitePhone,
							websiteAddress: websiteAddress,
						});
					}

					this.emailAddress?.disable();
					this.phoneNumber?.disable();
					// this.cellNumber?.disable();
				}
			},
			error: () => {
				this.notificationService.showNotification("An error has occurred while getting customer information");
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
				this.notificationService.showNotification("Error occurred while getting brokerage types");
			},
			complete: () => {
				this.loadingService.loadingOff();
			},
		});
	}

	brokerageChange(selectedBrokerage: any): void {
		for (const brokerage of this.brokerageTypes) {
			if (brokerage._id === selectedBrokerage) {
				this.existingLogoImage = brokerage.logoPath;
				break;
			}
		}
	}

	getTemplates() {
		this.templateService.getTemplates().subscribe({
			next: (response: any) => {
				if (response.data && response.data.length > 0) {
					this.templates = response.data;

					if (this.agentData && this.agentData.websiteSettings) {
						const { templateId } = this.agentData.websiteSettings;
						this.agentForm.patchValue({
							templateId: templateId,
						});
					}
				}
			},
			error: (error) => {
				this.notificationService.showNotification("Error occurred while getting templates");
			},
		});
	}

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
				brokerageTypeId,
				siteUrl,
				templateId,
				primaryColor,
				secondaryColor,
				facebook,
				twitter,
				instagram,
				linkedin,
				youtube,
				websiteEmail,
				websitePhone,
				websiteAddress,
			} = this.agentForm.value;

			const params = {
				businessName: businessName,
				firstName: firstName,
				lastName: lastName,
				address: address,
				brokerageTypeId: brokerageTypeId,
				websiteSettings: {
					siteUrl: siteUrl,
					templateId,
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
						address: websiteAddress,
					},
					profileImage: this.newSelectedProfileImage ? this.newSelectedProfileImage : this.existingProfileImage,
					logoImage: this.newSelectedLogoImage ? this.newSelectedLogoImage : this.existingLogoImage,
				},
			};
			this.customerService.update(params).subscribe({
				next: (v) => {},
				error: (e) => {
					this.notificationService.showNotification("Something went wrong while updating information.");
				},
				complete: () => {
					this.notificationService.showNotification("Profile updated successfully");
					this.loadingService.loadingOff();
				},
			});
		}
	}

	logout() {
		this.customerService.logout();
		this.router.navigate(["/login"]);
	}

	onProfileImageChange(event: Event): void {
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Profile Image",
			height: "80%",
			width: "80%",
			closable: false,
			closeOnEscape: false,
			focusOnShow: false, // Keep this
			data: {
				imageChangedEvent: event,
			},
		});
		ref.onClose.subscribe((croppedImage: string | null) => {
			this.newSelectedProfileImage = null;
			this.cdRef.detectChanges();
			this.zone.run(() => {});

			setTimeout(() => {
				this.newSelectedProfileImage = croppedImage;
				this.zone.run(() => {});
			}, 10);
		});
	}

	onLogoImageChange(event: Event): void {
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
			this.newSelectedLogoImage = croppedImage;
		});
	}

	openTemplateDialog() {
		let dialogRef = this.dialog.open(TemplateSelectionDialogComponent, {
			maxHeight: "90vh",
			maxWidth: "90vw",
			width: "90vw",
			height: "90vh",
			data: {
				templates: this.templates,
			},
		});

		dialogRef.afterClosed().subscribe((selectedTemplate: TemplateModel) => {
			if (selectedTemplate) {
				this.agentForm.patchValue({
					templateId: selectedTemplate.templateKey,
				});
			}
		});
	}
}
