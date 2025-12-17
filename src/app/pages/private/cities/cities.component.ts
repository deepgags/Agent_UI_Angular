import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { BehaviorSubject, Observable } from "rxjs";
import { ImageDialogComponent } from "../../../components/image-dialog/image-dialog.component";
import { environment } from "../../../environments/environment.development";
import { City } from "../../../models/City";
import { BlobToUrlPipe } from "../../../pipes/blob-to-url";
import { CitiesService } from "../../../services/cities.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";

@Component({
	selector: "app-cities",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		DialogModule,
		ButtonModule,
		InputTextModule,
		ConfirmDialogModule,
		ToastModule,
		TableModule,
		DynamicDialogModule,
		IftaLabelModule,
		BlobToUrlPipe,
	],
	templateUrl: "./cities.component.html",
	styleUrl: "./cities.component.scss",
	providers: [ConfirmationService, DialogService],
})
export class CitiesComponent implements OnInit {
	_fileSizeLimit = 2097152; //2MB
	@ViewChild("cityImageUpload", { static: false }) cityImageUpload!: ElementRef<HTMLInputElement>;

	cities: City[] = [];
	cityDialogVisible = false;
	cityForm!: FormGroup;
	editingCity: City | null = null;

	cityImage: BehaviorSubject<Blob | null>;
	cityImageObservable: Observable<Blob | null>;

	localImageBaseUrl = environment.localImageUrl;

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private citiesService: CitiesService,
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService,
		public dialogService: DialogService
	) {
		this.cityImage = new BehaviorSubject<Blob | null>(null);
		this.cityImageObservable = this.cityImage.asObservable();
	}

	get name() {
		return this.cityForm.get("name");
	}

	get image() {
		return this.cityForm.get("image");
	}

	ngOnInit() {
		this.initializeForm();
		this.getCities();
	}

	private initializeForm() {
		this.cityForm = this.fb.group({
			name: new FormControl("", [Validators.required]),
			image: new FormControl("", [Validators.required]),
		});
	}

	private getCities() {
		this.loadingService.loadingOn();
		this.citiesService.getCities().subscribe({
			next: (response) => {
				if (response.status) {
					this.cities = response.data;
				}
				this.loadingService.loadingOff();
			},
			error: () => {
				this.notificationService.showError("Failed to load cities");
				this.loadingService.loadingOff();
			},
		});
	}

	openAddCityDialog() {
		this.editingCity = null;
		this.cityForm.reset();
		this.cityImage.next(null);
		this.cityDialogVisible = true;
	}

	saveCity() {
		if (this.cityForm.valid && this.cities.length < 10) {
			const formValue = this.cityForm.getRawValue();
			const formData = new FormData();

			formData.append("name", formValue.name);
			if (this.cityImage.value) {
				formData.append("image", this.cityImage.value);
			}

			this.loadingService.loadingOn();

			this.citiesService.addCity(formData).subscribe({
				next: (response) => {
					if (response.status) {
						this.cities.push(response.data);
						this.notificationService.showSuccess("City added successfully");
					}
					this.loadingService.loadingOff();
					this.cityDialogVisible = false;
				},
				error: (error) => {
					this.notificationService.showError(error.error?.message || "Failed to add city");
					this.loadingService.loadingOff();
				},
			});
		} else if (this.cities.length >= 10) {
			this.notificationService.showError("Maximum 10 cities allowed");
		} else {
			this.cityForm.markAllAsTouched();
		}
	}

	deleteCity(city: City) {
		this.confirmationService.confirm({
			header: "Delete City",
			message: `Do you want to delete "${city.name}"?`,
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
				this._confirmDeleteCity(city);
			},
			reject: () => {},
		});
	}

	private _confirmDeleteCity(city: City) {
		this.loadingService.loadingOn();
		this.citiesService.deleteCity(city._id!).subscribe({
			next: (response) => {
				if (response.status) {
					this.cities = this.cities.filter((c) => c._id !== city._id);
					this.notificationService.showSuccess("City deleted successfully");
				}
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to delete city");
				this.loadingService.loadingOff();
			},
		});
	}

	cancelDialog() {
		this.cityDialogVisible = false;
		this.editingCity = null;
	}

	onCityImageChange(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file && file.size > this._fileSizeLimit) {
			this.notificationService.showError("File size must be less than 2MB");
			return;
		}
		const ref = this.dialogService.open(ImageDialogComponent, {
			header: "Adjust City Image",
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
				this.cityImage.next(croppedImage);
				this.cityForm.patchValue({ image: croppedImage });
			} else {
				this.cityImage.next(null);
				this.cityForm.patchValue({ image: null });
			}
		});
	}
}
