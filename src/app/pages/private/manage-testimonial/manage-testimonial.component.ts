import { CommonModule } from "@angular/common";
import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import dayjs from "dayjs";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from "primeng/dynamicdialog";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { BehaviorSubject, Observable } from "rxjs";
import { ImageDialogComponent } from "../../../components/image-dialog/image-dialog.component";
import { BlobToUrlPipe } from "../../../pipes/blob-to-url";
import { NotificationService } from "../../../services/notification.service";
import { TestimonialService } from "../../../services/testimonial.service";

@Component({
	selector: "app-manage-testimonial",
	imports: [
		CommonModule,
		ReactiveFormsModule,
		IftaLabelModule,
		InputMaskModule,
		InputTextModule,
		DatePickerModule,
		DialogModule,
		DynamicDialogModule,
		BlobToUrlPipe,
	],
	templateUrl: "./manage-testimonial.component.html",
	styleUrl: "./manage-testimonial.component.scss",
	providers: [DialogService],
})
export class ManageTestimonialComponent {
	_fileSizeLimit = 2097152; //2MB
	@ViewChild("testimonialImageUpload", { static: false }) testimonialImageUpload!: ElementRef<HTMLInputElement>;

	form: FormGroup;
	testimonialImage: BehaviorSubject<Blob | null>;
	testimonialImageObservable: Observable<Blob | null>;

	private notificationService = inject(NotificationService);
	private ref = inject(DynamicDialogRef);
	private dialogConfig = inject(DynamicDialogConfig);
	private testimonialService = inject(TestimonialService);

	constructor(public dialogService: DialogService) {
		this.testimonialImage = new BehaviorSubject<Blob | null>(null);
		this.testimonialImageObservable = this.testimonialImage.asObservable();

		this.form = new FormGroup({
			name: new FormControl("", Validators.required),
			message: new FormControl("", Validators.required),
			date: new FormControl(new Date(), Validators.required),
			designation: new FormControl(""),
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
	get designation() {
		return this.form.get("designation");
	}

	onTestimonialImageChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && file.size > this._fileSizeLimit) {
			this.notificationService.showError("File size should not exceed 2MB.");
			return;
		}
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust Testimonial Image",
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
				this.testimonialImage.next(croppedImage);
			} else {
				this.testimonialImage.next(null);
			}
		});
	}

	removeTestimonialImage(): void {
		this.testimonialImage.next(null);
		if (this.testimonialImageUpload) {
			this.testimonialImageUpload.nativeElement.value = "";
		}
	}

	submitForm() {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		} else {
			const formData = new FormData();
			formData.append("name", this.form.value.name);
			formData.append("message", this.form.value.message);
			formData.append("date", dayjs(this.form.value.date).format("DD-MMM-YYYY"));
			if (this.form.value.designation) {
				formData.append("designation", this.form.value.designation);
			}
			if (this.testimonialImage.value) {
				formData.append("image", this.testimonialImage.value, "testimonial-image.png");
			}

			this.testimonialService.addTestimonial(formData).subscribe({
				next: () => {
					this.notificationService.showSuccess("Testimonial Added.");
					this.ref.close(true);
				},
				error: (error) => {
					// this.loading = false;
					console.error("Error deleting Testimonial:", error);
					this.notificationService.showError("Unable to remove Testimonial.");
				},
			});
		}
	}
}
