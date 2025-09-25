import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TemplateModel } from '../../models/TemplateModel';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
	selector: 'app-template-preview',
	imports: [DialogModule, DynamicDialogModule, GalleryComponent],
	templateUrl: './template-preview.component.html',
	styleUrl: './template-preview.component.scss'
})
export class TemplatePreviewComponent implements OnInit {
	template: TemplateModel | undefined

	constructor(
		private ref: DynamicDialogRef,
		private dialogConfig: DynamicDialogConfig
	) {
	}

	ngOnInit(): void {
		const { template } = this.dialogConfig.data;
		this.template = template;
	}

	setTemplate() {
		this.ref.close(true);
	}

	close() {
		this.ref.close()
	}
}
