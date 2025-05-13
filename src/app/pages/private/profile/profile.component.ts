import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ImageCropperComponent } from 'ngx-smart-cropper';
import { BrokerageTypeModel } from '../../../models/BrokerageTypeModel';
import { CustomerModel } from '../../../models/CustomerModel';
import { BrokerageTypeService } from '../../../services/brokerage.service';
import { CustomerService } from '../../../services/customer.service';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
	selector: 'app-profile',
	imports: [CommonModule, AngularSvgIconModule, FormsModule, ReactiveFormsModule, MatDialogModule,
		MatFormFieldModule, MatInputModule, MatSelectModule, ImageCropperComponent],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss'
})
export class ProfileComponent {

	agentForm!: FormGroup;
	agentData!: CustomerModel;
	brokerageTypes: BrokerageTypeModel[] = [];

	profileCroppedImage = '';
	profileImageSource: string = '';
	logoCroppedImage = '';
	logoImageSource: string = '';
	logoImagePath?: string = '';

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private customerService: CustomerService,
		private brokerageTypeService: BrokerageTypeService,
		private notificationService: NotificationService,
		private loadingService: LoadingService,
		private titleService: Title) {
		this.titleService.setTitle("Profile")
	}

	get emailAddress() {
		return this.agentForm.get('emailAddress');
	}
	get phoneNumber() {
		return this.agentForm.get('phoneNumber');
	}
	get cellNumber() {
		return this.agentForm.get('cellNumber');
	}

	ngOnInit() {
		this.agentForm = this.fb.group({
			businessName: new FormControl("", Validators.required),
			brokerageType: new FormControl("", Validators.required),
			firstName: new FormControl("", Validators.required),
			lastName: new FormControl("", Validators.required),
			phoneNumber: new FormControl(""),//, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
			cellNumber: new FormControl("", [Validators.required, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
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
	}

	getProfile() {
		this.customerService.getCustomer()
			.subscribe({
				next: (response: any) => {
					if (response.status) {
						this.agentData = response.data;

						this.profileImageSource = this.agentData.profileImage;
						this.logoImagePath = this.agentData.logoImage ?? "";

						this.agentForm.patchValue({
							businessName: this.agentData.businessName,
							firstName: this.agentData.firstName,
							lastName: this.agentData.lastName,
							address: this.agentData.address,
							emailAddress: this.agentData.emailAddress,
							phoneNumber: this.agentData.phoneNumber,
							cellNumber: this.agentData.cellNumber,
							brokerageType: this.agentData.brokerageTypeId,
							siteUrl: this.agentData.siteUrl
						});

						this.emailAddress?.disable();
						this.phoneNumber?.disable();
						this.cellNumber?.disable();

						this.logoImagePath = this.agentData.logoImage ?? "";
					}

				},
				error: () => {
					this.notificationService.showNotification("An error has occurred while getting customer information")
				},
				complete: () => {
				}
			})
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
			complete: () => { this.loadingService.loadingOff(); }
		})
	}

	brokerageChange(selectedBrokerage: any): void {
		this.logoImagePath = selectedBrokerage.LogoPath;
	}

	save() {
		const { valid } = this.agentForm;
		if (valid) {
			this.agentData.profileImage = this.profileImageSource;
			this.agentData.logoImage = this.logoImageSource;
			// this.agentData.logoImagePath = this.logoImagePath;
			this.loadingService.loadingOn();
			const { businessName,
				firstName,
				lastName,
				address,
				brokerageTypeId,
				siteUrl } = this.agentForm.value;

			const params = {
				businessName: businessName,
				firstName: firstName,
				lastName: lastName,
				address: address,
				brokerageTypeId: brokerageTypeId,
				siteUrl: siteUrl
			}
			this.customerService.update(params).subscribe({
				next: (v) => {

				},
				error: (e) => {
					this.notificationService.showNotification('Something went wrong while updating information.');
				},
				complete: () => {
					this.notificationService.showNotification("Profile updated successfully")
					this.loadingService.loadingOff();
				}
			});
		}

		// Save Website Settings
		const {
			templateId,
			primaryColor,
			secondaryColor,
			logoUrl,
			facebook,
			twitter,
			instagram,
			linkedin,
			youtube,
			websiteEmail,
			websitePhone,
			websiteAddress
		} = this.agentForm.value;

		const websiteSettings = {
			templateId,
			primaryColor,
			secondaryColor,
			logoUrl,
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
				address: websiteAddress
			}
		};

		this.customerService.saveWebsiteSettings(websiteSettings).subscribe({
			next: () => {
				this.notificationService.showNotification("Website settings saved successfully");
			},
			error: () => {
				this.notificationService.showNotification("Failed to save website settings");
			},
			complete: () => {
				this.loadingService.loadingOff();
			}
		});
	}

	logout() {
		this.customerService.logout();
		this.router.navigate(['/login']);
	}

	onFileChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const file = input.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				if (input?.id == "profileImageUpload") {
					this.profileImageSource = e.target.result;
				}
				else {
					this.logoImageSource = e.target.result;
				}
			};
			reader.readAsDataURL(file);
		}
	}

	profileImageCropped(event: any) {
		this.profileCroppedImage = event;
	}

	logoImageCropped(event: any) {
		this.logoCroppedImage = event;
	}
}
