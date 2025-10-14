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
	],
	templateUrl: "./manage-testimonial.component.html",
	styleUrl: "./manage-testimonial.component.scss",
	providers: [DialogService],
})
export class ManageTestimonialComponent {
	_fileSizeLimit = 2097152; //2MB
	@ViewChild("testimonialImageUpload", { static: false }) testimonialImageUpload!: ElementRef<HTMLInputElement>;

	form: FormGroup;
	testimonialImage: BehaviorSubject<string>;
	testimonialImageObservable: Observable<string>;

	private notificationService = inject(NotificationService);
	private ref = inject(DynamicDialogRef);
	private dialogConfig = inject(DynamicDialogConfig);
	private testimonialService = inject(TestimonialService);

	constructor(public dialogService: DialogService) {
		this.testimonialImage = new BehaviorSubject("");
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
		ref.onClose.subscribe((croppedImage: string) => {
			if (croppedImage) {
				this.testimonialImage.next(croppedImage);
			} else {
				this.testimonialImage.next("");
			}
		});
	}

	removeTestimonialImage(): void {
		this.testimonialImage.next("");
		if (this.testimonialImageUpload) {
			this.testimonialImageUpload.nativeElement.value = "";
		}
	}

	submitForm() {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		} else {
			const data = {
				...this.form.value,
				date: dayjs(this.form.value.date).format("DD-MMM-YYYY"),
				image: this.testimonialImage.value,
			};
			this.testimonialService.addTestimonial(data).subscribe({
				next: () => {
					this.notificationService.showSuccess("Testimonial Added.");
					this.ref.close(true);
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
