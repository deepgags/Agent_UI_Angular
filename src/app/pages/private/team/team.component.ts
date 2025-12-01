import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { BehaviorSubject, Observable } from "rxjs";
import { ImageDialogComponent } from "../../../components/image-dialog/image-dialog.component";
import { TeamMemberModel } from "../../../models/TeamMemberModel";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";
import { TeamService } from "../../../services/team.service";

@Component({
	selector: "app-team",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		DialogModule,
		ButtonModule,
		InputMaskModule,
		InputTextModule,
		TextareaModule,
		ConfirmDialogModule,
		ToastModule,
		TableModule,
		TooltipModule,
		DynamicDialogModule,
		IftaLabelModule,
	],
	templateUrl: "./team.component.html",
	styleUrl: "./team.component.scss",
	providers: [ConfirmationService, DialogService],
})
export class TeamComponent implements OnInit {
	_fileSizeLimit = 2097152; //2MB
	@ViewChild("profileImageUpload", { static: false }) profileImageUpload!: ElementRef<HTMLInputElement>;

	teamMembers: TeamMemberModel[] = [];
	teamDialogVisible = false;
	teamForm!: FormGroup;
	editingMember: TeamMemberModel | null = null;

	profileImage: BehaviorSubject<string>;
	profileImageObservable: Observable<string>;

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private teamService: TeamService,
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService,
		public dialogService: DialogService
	) {
		this.profileImage = new BehaviorSubject("");
		this.profileImageObservable = this.profileImage.asObservable();
	}

	ngOnInit() {
		this.initializeForm();
		this.getTeamMembers();
	}

	private initializeForm() {
		this.teamForm = this.fb.group({
			firstName: new FormControl("", [Validators.required]),
			lastName: new FormControl(""),
			designation: new FormControl("", [Validators.required]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			phoneNumber: new FormControl("", [Validators.required]),
			profileImage: new FormControl("", [Validators.required]),
			siteUrl: new FormControl("", [
				Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
			]),
			facebook: new FormControl(""),
			twitter: new FormControl(""),
			instagram: new FormControl(""),
			linkedin: new FormControl(""),
			youtube: new FormControl(""),
		});
	}

	private getTeamMembers() {
		this.loadingService.loadingOn();
		this.teamService.getTeamMembers().subscribe({
			next: (response) => {
				if (response.status) {
					this.teamMembers = response.data;
				}
				this.loadingService.loadingOff();
			},
			error: () => {
				this.notificationService.showError("Failed to load team members");
				this.loadingService.loadingOff();
			},
		});
	}

	openAddMemberDialog() {
		this.editingMember = null;
		this.teamForm.reset();
		this.profileImage.next("");
		this.teamDialogVisible = true;
	}

	openEditMemberDialog(member: TeamMemberModel) {
		this.editingMember = member;
		this.teamDialogVisible = true;

		setTimeout(() => {
			this.teamForm.patchValue({
				firstName: member.firstName,
				lastName: member.lastName || "",
				designation: member.designation,
				emailAddress: member.emailAddress,
				phoneNumber: member.phoneNumber,
				profileImage: member.profileImage,
				siteUrl: member.siteUrl || "",
				facebook: member.socialLinks?.facebook || "",
				twitter: member.socialLinks?.twitter || "",
				instagram: member.socialLinks?.instagram || "",
				linkedin: member.socialLinks?.linkedin || "",
				youtube: member.socialLinks?.youtube || "",
			});
			this.profileImage.next(member.profileImage);
		}, 150);
	}

	saveMember() {
		if (this.teamForm.valid) {
			const formValue = this.teamForm.getRawValue();
			const memberData = {
				firstName: formValue.firstName,
				lastName: formValue.lastName,
				designation: formValue.designation,
				emailAddress: formValue.emailAddress,
				phoneNumber: formValue.phoneNumber,
				profileImage: formValue.profileImage,
				siteUrl: formValue.siteUrl,
				socialLinks: {
					facebook: formValue.facebook,
					twitter: formValue.twitter,
					instagram: formValue.instagram,
					linkedin: formValue.linkedin,
					youtube: formValue.youtube,
				},
			};

			this.loadingService.loadingOn();

			if (this.editingMember) {
				this.teamService.updateTeamMember(this.editingMember._id!, memberData).subscribe({
					next: (response) => {
						if (response.status) {
							const index = this.teamMembers.findIndex((m) => m._id === this.editingMember!._id);
							if (index !== -1) {
								this.teamMembers[index] = response.data;
							}
							this.notificationService.showSuccess("Team member updated successfully");
						}
						this.loadingService.loadingOff();
						this.teamDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || "Failed to update team member");
						this.loadingService.loadingOff();
					},
				});
			} else {
				this.teamService.addTeamMember(memberData).subscribe({
					next: (response) => {
						if (response.status) {
							this.teamMembers.push(response.data);
							this.notificationService.showSuccess("Team member added successfully");
						}
						this.loadingService.loadingOff();
						this.teamDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || "Failed to add team member");
						this.loadingService.loadingOff();
					},
				});
			}
		} else {
			this.teamForm.markAllAsTouched();
		}
	}

	deleteMember(member: TeamMemberModel) {
		this.confirmationService.confirm({
			header: "Delete Team Member",
			message: `Do you want to delete "${member.firstName} ${member.lastName || ""}"?`,
			icon: "bi bi-trash3",
			rejectLabel: "Cancel",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Delete",
				severity: "danger",
			},
			accept: () => {
				this._confirmDeleteMember(member);
			},
			reject: () => {},
		});
	}

	private _confirmDeleteMember(member: TeamMemberModel) {
		this.loadingService.loadingOn();
		this.teamService.deleteTeamMember(member._id!).subscribe({
			next: (response) => {
				if (response.status) {
					this.teamMembers = this.teamMembers.filter((m) => m._id !== member._id);
					this.notificationService.showSuccess("Team member deleted successfully");
				}
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to delete team member");
				this.loadingService.loadingOff();
			},
		});
	}

	cancelDialog() {
		this.teamDialogVisible = false;
		this.editingMember = null;
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
				this.profileImage.next(croppedImage);
				this.teamForm.patchValue({ profileImage: croppedImage });
			} else {
				this.profileImage.next("");
				this.teamForm.patchValue({ profileImage: "" });
			}
		});
	}

	// Form control getters for template access
	get firstName() {
		return this.teamForm.get("firstName");
	}

	get lastName() {
		return this.teamForm.get("lastName");
	}

	get designation() {
		return this.teamForm.get("designation");
	}

	get emailAddress() {
		return this.teamForm.get("emailAddress");
	}

	get phoneNumber() {
		return this.teamForm.get("phoneNumber");
	}

	get profileImageControl() {
		return this.teamForm.get("profileImage");
	}

	get siteUrl() {
		return this.teamForm.get("siteUrl");
	}
}
