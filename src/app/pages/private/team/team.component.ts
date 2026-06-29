import { CommonModule, DatePipe } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageDialogComponent } from '../../../components/image-dialog/image-dialog.component';
import { environment } from '../../../environments/environment.development';
import { TeamMemberModel } from '../../../models/TeamMemberModel';
import { BlobToUrlPipe } from '../../../pipes/blob-to-url';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';
import { TeamService } from '../../../services/team.service';

@Component({
	selector: 'app-team',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule, DialogModule, ButtonModule, InputMaskModule, InputTextModule, TextareaModule, ConfirmDialogModule, ToastModule, TooltipModule, DynamicDialogModule, IftaLabelModule, DragDropModule, BlobToUrlPipe],
	templateUrl: './team.component.html',
	styleUrl: './team.component.scss',
	providers: [ConfirmationService, DialogService],
})
export class TeamComponent implements OnInit {
	_fileSizeLimit = 2097152; //2MB
	@ViewChild('profileImageUpload', { static: false }) profileImageUpload!: ElementRef<HTMLInputElement>;

	teamMembers: TeamMemberModel[] = [];
	teamDialogVisible = false;
	teamForm!: FormGroup;
	editingMember: TeamMemberModel | null = null;
	existingProfileImage = '';

	profileImage: BehaviorSubject<Blob | null>;
	profileImageObservable: Observable<Blob | null>;

	localImageBaseUrl = environment.localImageUrl;

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private teamService: TeamService,
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService,
		public dialogService: DialogService,
	) {
		this.profileImage = new BehaviorSubject<Blob | null>(null);
		this.profileImageObservable = this.profileImage.asObservable();
	}

	ngOnInit() {
		this.initializeForm();
		this.getTeamMembers();
	}

	private initializeForm() {
		this.teamForm = this.fb.group({
			firstName: new FormControl('', [Validators.required]),
			lastName: new FormControl(''),
			designation: new FormControl('', [Validators.required]),
			emailAddress: new FormControl('', [Validators.email]),
			phoneNumber: new FormControl('', [Validators.required]),
			profileImage: new FormControl('', [Validators.required]),
			siteUrl: new FormControl('', [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]),
			about: new FormControl(''),
			address: new FormControl(''),
			facebook: new FormControl(''),
			twitter: new FormControl(''),
			instagram: new FormControl(''),
			linkedin: new FormControl(''),
			youtube: new FormControl(''),
		});
	}

	private getTeamMembers() {
		this.loadingService.loadingOn();
		this.teamService.getTeamMembers().subscribe({
			next: (response) => {
				if (response.status) {
					this.teamMembers = this.sortTeamMembers(response.data);
				}
				this.loadingService.loadingOff();
			},
			error: () => {
				this.notificationService.showError('Failed to load team members');
				this.loadingService.loadingOff();
			},
		});
	}

	openAddMemberDialog() {
		this.editingMember = null;
		this.teamForm.reset();
		this.profileImage.next(null);
		this.teamDialogVisible = true;
	}

	openEditMemberDialog(member: TeamMemberModel) {
		this.editingMember = member;
		this.existingProfileImage = member.profileImage;
		this.teamDialogVisible = true;

		setTimeout(() => {
			this.teamForm.patchValue({
				firstName: member.firstName,
				lastName: member.lastName || '',
				designation: member.designation,
				emailAddress: member.emailAddress,
				phoneNumber: member.phoneNumber,
				profileImage: member.profileImage,
				siteUrl: member.siteUrl || '',
				about: member.about || '',
				address: member.address || '',
				facebook: member.socialLinks?.facebook || '',
				twitter: member.socialLinks?.twitter || '',
				instagram: member.socialLinks?.instagram || '',
				linkedin: member.socialLinks?.linkedin || '',
				youtube: member.socialLinks?.youtube || '',
			});
			// For editing, we don't set the BehaviorSubject since the image is already uploaded
			// The form will show the existing image URL
		}, 150);
	}

	saveMember() {
		if (this.teamForm.valid) {
			const formValue = this.teamForm.getRawValue();
			const formData = new FormData();

			formData.append('firstName', formValue.firstName);
			if (formValue.lastName) formData.append('lastName', formValue.lastName);
			formData.append('designation', formValue.designation);
			formData.append('emailAddress', formValue.emailAddress);
			formData.append('phoneNumber', formValue.phoneNumber);
			if (this.profileImage.value) {
				formData.append('profileImage', this.profileImage.value, 'profile-image.png');
			}
			if (formValue.siteUrl) formData.append('siteUrl', formValue.siteUrl);
			if (formValue.about) formData.append('about', formValue.about);
			if (formValue.address) formData.append('address', formValue.address);
			if (formValue.facebook) formData.append('facebook', formValue.facebook);
			if (formValue.twitter) formData.append('twitter', formValue.twitter);
			if (formValue.instagram) formData.append('instagram', formValue.instagram);
			if (formValue.linkedin) formData.append('linkedin', formValue.linkedin);
			if (formValue.youtube) formData.append('youtube', formValue.youtube);

			this.loadingService.loadingOn();

			if (this.editingMember) {
				this.teamService.updateTeamMember(this.editingMember._id!, formData).subscribe({
					next: (response) => {
						if (response.status) {
							const index = this.teamMembers.findIndex((m) => m._id === this.editingMember!._id);
							if (index !== -1) {
								this.teamMembers[index] = response.data;
								this.teamMembers = this.sortTeamMembers([...this.teamMembers]);
							}
							this.notificationService.showSuccess('Team member updated successfully');
						}
						this.loadingService.loadingOff();
						this.teamDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || 'Failed to update team member');
						this.loadingService.loadingOff();
					},
				});
			} else {
				this.teamService.addTeamMember(formData).subscribe({
					next: (response) => {
						if (response.status) {
							this.teamMembers = this.sortTeamMembers([...this.teamMembers, response.data]);
							this.notificationService.showSuccess('Team member added successfully');
						}
						this.loadingService.loadingOff();
						this.teamDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || 'Failed to add team member');
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
			header: 'Delete Team Member',
			message: `Do you want to delete "${member.firstName} ${member.lastName || ''}"?`,
			icon: 'bi bi-trash3',
			rejectLabel: 'Cancel',
			rejectButtonProps: {
				label: 'Cancel',
				severity: 'secondary',
				outlined: true,
			},
			acceptButtonProps: {
				label: 'Delete',
				severity: 'danger',
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
					this.notificationService.showSuccess('Team member deleted successfully');
				}
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || 'Failed to delete team member');
				this.loadingService.loadingOff();
			},
		});
	}

	onTeamMemberDrop(event: CdkDragDrop<TeamMemberModel[]>): void {
		if (event.previousIndex === event.currentIndex) {
			return;
		}

		const previousMembers = [...this.teamMembers];
		moveItemInArray(this.teamMembers, event.previousIndex, event.currentIndex);

		const memberIds = this.teamMembers.map((member) => member._id).filter((memberId): memberId is string => !!memberId);
		if (memberIds.length !== this.teamMembers.length) {
			this.teamMembers = previousMembers;
			this.notificationService.showError('Unable to reorder team members');
			return;
		}

		this.loadingService.loadingOn();
		this.teamService.reorderTeamMembers(memberIds).subscribe({
			next: (response) => {
				if (response.status) {
					this.teamMembers = this.sortTeamMembers(response.data);
					this.notificationService.showSuccess('Team member order updated successfully');
				}
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.teamMembers = previousMembers;
				this.notificationService.showError(error.error?.message || 'Failed to reorder team members');
				this.loadingService.loadingOff();
			},
		});
	}

	cancelDialog() {
		this.teamDialogVisible = false;
		this.editingMember = null;
	}

	private sortTeamMembers(teamMembers: TeamMemberModel[]): TeamMemberModel[] {
		return [...teamMembers].sort((left, right) => {
			const leftOrder = typeof left.order === 'number' ? left.order : Number.MAX_SAFE_INTEGER;
			const rightOrder = typeof right.order === 'number' ? right.order : Number.MAX_SAFE_INTEGER;
			if (leftOrder !== rightOrder) {
				return leftOrder - rightOrder;
			}

			const leftCreatedAt = left.createdAt ? new Date(left.createdAt).getTime() : 0;
			const rightCreatedAt = right.createdAt ? new Date(right.createdAt).getTime() : 0;
			if (leftCreatedAt !== rightCreatedAt) {
				return leftCreatedAt - rightCreatedAt;
			}

			return `${left.firstName} ${left.lastName || ''}`.localeCompare(`${right.firstName} ${right.lastName || ''}`);
		});
	}

	onProfileImageChange(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.size > this._fileSizeLimit) {
			this.notificationService.showError('File size must be less than 2MB');
			return;
		}
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: 'Adjust Profile Image',
			height: '80%',
			width: '80%',
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
				this.profileImage.next(croppedImage);
				this.teamForm.patchValue({ profileImage: croppedImage });
			} else {
				this.profileImage.next(null);
				this.teamForm.patchValue({ profileImage: null });
			}
		});
	}

	// Form control getters for template access
	get firstName() {
		return this.teamForm.get('firstName');
	}

	get lastName() {
		return this.teamForm.get('lastName');
	}

	get designation() {
		return this.teamForm.get('designation');
	}

	get emailAddress() {
		return this.teamForm.get('emailAddress');
	}

	get phoneNumber() {
		return this.teamForm.get('phoneNumber');
	}

	get profileImageControl() {
		return this.teamForm.get('profileImage');
	}

	get siteUrl() {
		return this.teamForm.get('siteUrl');
	}

	get about() {
		return this.teamForm.get('about');
	}

	get address() {
		return this.teamForm.get('address');
	}
}
