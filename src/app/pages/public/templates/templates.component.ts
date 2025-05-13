import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { GalleryComponent } from '../../../components/gallery/gallery.component';
import { TemplateModel } from '../../../models/TemplateModel';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';
import { TemplateService } from '../../../services/template.service';

@Component({
	selector: 'app-templates',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, GalleryComponent],
	templateUrl: './templates.component.html',
	styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
	isBrowser: boolean = false;
	templateForm!: FormGroup;
	private templatesSubject = new BehaviorSubject<TemplateModel[]>([]);
	templates$ = this.templatesSubject.asObservable();

	constructor(
		private templateService: TemplateService,
		private titleService: Title,
		private loadingService: LoadingService,
		private router: Router,
		private notificationService: NotificationService,
		@Inject(PLATFORM_ID) platformId: Object
	) {
		this.titleService.setTitle('Templates');
		this.isBrowser = isPlatformBrowser(platformId);
	}

	ngOnInit() {
		this.getTemplates();
	}

	getTemplates() {
		this.loadingService.loadingOn();
		this.templateService.getTemplates().subscribe({
			next: (response: any) => {
				if (response.data && response.data.length > 0) {
					this.templatesSubject.next(response.data);
				}
			},
			error: (error) => {
				this.notificationService.showNotification("Error occurred while getting templates");
			},
			complete: () => { this.loadingService.loadingOff() }
		});
	}

	previewTemplate(template: TemplateModel) {
		debugger
		const url = this.router.serializeUrl(
			this.router.createUrlTree(['/', template.templateKey])
		);
		window.open(url, '_blank');
		// this.loadingService.loadingOn();
		// this.customerService.templatePreviewAvailable(template._id)
		// 	.subscribe({
		// 		next: (response) => {
		// 			if (response && response.customerId != "") {
		// 				this.router.navigate([]).then(result => { window.open('loading', '_blank'); });
		// 				return;
		// 			}
		// 			this.notificationService.showNotification('No data exist for template preview')
		// 		},
		// 		error: () => {
		// 			this.notificationService.showNotification('Error occurred exist while template preview')
		// 		},
		// 		complete: () => {
		// 			this.loadingService.loadingOff()
		// 		}
		// 	})
	}
}
