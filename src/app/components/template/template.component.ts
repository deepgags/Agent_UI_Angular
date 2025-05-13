import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Title } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbCarouselConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { CustomerModel } from '../../models/CustomerModel';
import { TemplateModel } from '../../models/TemplateModel';
import { CustomerService } from '../../services/customer.service';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { SharedDataService } from '../../services/shareddata.service';
import { StorageService } from '../../services/storage.service';
import { TemplateService } from '../../services/template.service';
import { TemplatesiteComponent } from '../dialogs/templatesite/templatesite.component';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
	selector: 'app-template',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
		MatInputModule, NgbModule, GalleryComponent],
	providers: [provideAnimations(), NgbCarouselConfig],
	templateUrl: './template.component.html',
	styleUrl: './template.component.scss'
})

export class TemplateComponent implements OnInit {
	isBrowser: boolean = false;
	templateForm!: FormGroup;
	customerModel!: CustomerModel;
	private templatesSubject = new BehaviorSubject<TemplateModel[]>([]);
	templates$ = this.templatesSubject.asObservable();

	constructor(
		breakpointObserver: BreakpointObserver,
		private _siteDialog: MatDialog,
		private customerService: CustomerService,
		private storageService: StorageService,
		private templateService: TemplateService,
		private notificationService: NotificationService,
		private titleService: Title,
		private loadingService: LoadingService,
		private sharedDataService: SharedDataService,
		private router: Router,
		@Inject(PLATFORM_ID) platformId: Object
	) {
		this.titleService.setTitle('Templates');
		this.isBrowser = isPlatformBrowser(platformId);
	}

	ngOnInit() {
		this.sharedDataService.CustomerData.subscribe(data => {
			this.customerModel = data;
			this.getTemplates();
			// this.setGalleryImages();
		});
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

	// setGalleryImages() {
	// 	this.templatesSubject.subscribe(x => {
	// 		x.forEach(template => {
	// 			this.galleryRef = this.gallery.ref(template.id);
	// 			template.images?.forEach(x => {
	// 				if (this.galleryRef) {
	// 					this.galleryRef.add(new ImageItem(
	// 						{
	// 							src: x,
	// 							thumb: x
	// 						}));
	// 				}
	// 			})
	// 		})
	// 	});
	// }

	openDialog() {
		this._siteDialog.open(TemplatesiteComponent,
			{
				width: '50%',
				height: 'auto',
				disableClose: true,
				autoFocus: false,
				restoreFocus: false,
				hasBackdrop: true,
				data: this.customerModel
			}
		)
	}

	selectTemplate(template: TemplateModel, sender: any) {
		template.isSelected = !template.isSelected;
		if (template.isSelected) {
			// this.customerModel.templateId = template._id;
		}

		this.templates$.subscribe(x => x.forEach(item => {
			if (template._id != item._id) {
				item.isSelected = false
			}
		}));
	}

	previewTemplate(template: TemplateModel, sender: any) {
		this.loadingService.loadingOn();
		this.customerService.templatePreviewAvailable(template._id)
			.subscribe({
				next: (response) => {
					if (response && response._id != "") {
						this.storageService.saveUserInfo(JSON.stringify(response));
						this.router.navigate([]).then(result => { window.open('loading', '_blank'); });
						return;
					}
					this.notificationService.showNotification('No data exist for template preview')
				},
				error: () => {
					this.notificationService.showNotification('Error occurred exist while template preview')
				},
				complete: () => {
					this.loadingService.loadingOff()
				}
			})
	}

	save() {
		// 	if (this.customerModel.templateId != "") {
		// 		this.openDialog();
		// 	}
		// 	else {
		// 		this.notificationService.showNotification("Please select template")
		// 	}
	}
}
