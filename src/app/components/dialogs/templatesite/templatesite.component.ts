import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustomerModel } from '../../../models/CustomerModel';
import { CustomerService } from '../../../services/customer.service';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
	selector: 'app-templatesite',
	imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
	templateUrl: './templatesite.component.html',
	styleUrl: './templatesite.component.scss'
})
export class TemplatesiteComponent implements OnInit {

	templateForm!: FormGroup;
	readonly dialogRef = inject(MatDialogRef<TemplatesiteComponent>);

	constructor(@Inject(MAT_DIALOG_DATA) public customerData: CustomerModel,
		private fb: FormBuilder,
		private router: Router,
		private customerService: CustomerService,
		private titleService: Title,
		private loadingService: LoadingService,
		private notificationService: NotificationService) {
		this.titleService.setTitle("Site Url")
	}

	ngOnInit(): void {
		this.templateForm = this.fb.group({
			siteUrl: new FormControl("", [Validators.required]),
		});

		this.templateForm.valueChanges.subscribe(
			(data) => {
				if (JSON.stringify(data) !== JSON.stringify({})) {
					this.customerData.siteUrl = data.siteUrl;
				}
			});
	}

	close() {
		this.dialogRef.close();
		this.titleService.setTitle("Templates")
	}

	save() {
		const { valid } = this.templateForm;
		if (valid) {
			this.loadingService.loadingOn();
			this.customerService.save(this.customerData).subscribe({
				next: (v) => { },
				error: (e) => {
					this.notificationService.showNotification('Something went wrong while saving information.');
				},
				complete: () => {
					this.dialogRef.close();
					this.loadingService.loadingOff();
					this.router.navigateByUrl("payment")
				}
			})

		}
	}

}
