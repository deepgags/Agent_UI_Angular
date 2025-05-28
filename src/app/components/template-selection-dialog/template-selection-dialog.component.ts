import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateModel } from '../../models/TemplateModel';
import { NotificationService } from '../../services/notification.service';
import { TemplateService } from '../../services/template.service';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
	selector: 'app-template-selection-dialog',
	imports: [CommonModule, GalleryComponent],
	templateUrl: './template-selection-dialog.component.html',
	styleUrl: './template-selection-dialog.component.scss'
})

export class TemplateSelectionDialogComponent {
	// constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
	readonly templateService = inject(TemplateService);
	readonly notificationService = inject(NotificationService);
	readonly dialogRef = inject(MatDialogRef<TemplateSelectionDialogComponent>);
	readonly data = inject(MAT_DIALOG_DATA);

	templates: any[] = [];
	selectedTemplate: string = '';

	ngOnInit(): void {
		console.log(this.data)
		this.templates = this.data.templates
	}


	selectTemplate(template: TemplateModel) {
		// this.selectedTemplate = template._id;
		this.dialogRef.close(template);
	}

	close() {
		this.dialogRef.close();
	}

}
