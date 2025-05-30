import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { ImageCroppedEvent, ImageCropperComponent, OutputFormat } from "ngx-image-cropper";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
	selector: "app-image-dialog",
	templateUrl: "./image-dialog.component.html",
	styleUrls: ["./image-dialog.component.scss"],
	standalone: true,
	imports: [CommonModule, ImageCropperComponent],
})
export class ImageDialogComponent {
	imageChangedEvent: any;
	croppedImage: any;
	image: any;
	isImageCroppingInProgress = false;
	maintainRatio = true;
	fileFormat: OutputFormat = "jpeg";
	constructor(private ref: DynamicDialogRef, private dialogConfig: DynamicDialogConfig) {
		const { imageChangedEvent, freeSelection } = this.dialogConfig.data;
		this.imageChangedEvent = imageChangedEvent;

		if (freeSelection) {
			this.maintainRatio = false;
		}
		// }
	}

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	confirmImage = () => {
		this.ref.close(this.croppedImage);
	};

	cancelImageSelection = () => {
		this.ref.close(null);
	};
}
