import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../../services/notification.service';
import { TestimonialService } from '../../../services/testimonial.service';

@Component({
	selector: 'app-manage-testimonial',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		IftaLabelModule,
		InputMaskModule,
		InputTextModule,
		DatePickerModule,
		DialogModule, DynamicDialogModule
	],
	templateUrl: './manage-testimonial.component.html',
	styleUrl: './manage-testimonial.component.scss'
})
export class ManageTestimonialComponent {
	form: FormGroup;
	private notificationService = inject(NotificationService);
	private ref = inject(DynamicDialogRef);
	private dialogConfig = inject(DynamicDialogConfig)
	private testimonialService = inject(TestimonialService);

	constructor(
	) {
		this.form = new FormGroup({
			name: new FormControl("", Validators.required),
			message: new FormControl("", Validators.required),
			date: new FormControl(new Date(), Validators.required),
		});

		const { testimonial } = this.dialogConfig.data;
		if (testimonial) {
			// TODO: patch value here.
		}

	}

	get name() {
		return this.form.get("name");
	}
	get message() {
		return this.form.get("message");
	}
	get date() {
		return this.form.get("date");
	}


	submitForm() {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return
		} else {
			const data = { ...this.form.value, date: dayjs(this.form.value.date).format('DD-MMM-YYYY') }
			this.testimonialService.addTestimonial(data).subscribe({
				next: () => {
					this.notificationService.showSuccess("Testimonial Added.");
					this.ref.close(true)
				},
				error: (error) => {
					// this.loading = false;
					console.error("Error deleting Testimonial:", error);
					this.notificationService.showSuccess("Unable to remove Testimonial.");
				},
			});
		}
	}
}
