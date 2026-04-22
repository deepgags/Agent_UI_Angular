import { CommonModule } from "@angular/common";
import { Component, OnInit, WritableSignal } from "@angular/core";

import { Title } from "@angular/platform-browser";

import { DialogModule } from "primeng/dialog";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { BehaviorSubject } from "rxjs";
import { GalleryComponent } from "../../../components/gallery/gallery.component";
import { TemplatePreviewComponent } from "../../../components/template-preview/template-preview.component";
import { CustomerModel } from "../../../models/CustomerModel";
import { SiteConfig } from "../../../models/SiteConfig";
import { TemplateModel } from "../../../models/TemplateModel";
import { CustomerService } from "../../../services/customer.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";
import { SharedDataService } from "../../../services/shared-data.service";
import { TemplateService } from "../../../services/template.service";

@Component({
	selector: "app-template",
	imports: [CommonModule, GalleryComponent, DialogModule, DynamicDialogModule],
	providers: [DialogService],
	templateUrl: "./template.component.html",
	styleUrl: "./template.component.scss",
})
export class TemplateComponent implements OnInit {
	selectedTemplate: any = null;
	customerModel!: CustomerModel;
	private templatesSubject = new BehaviorSubject<TemplateModel[]>([]);
	templates$ = this.templatesSubject.asObservable();
	siteConfig: SiteConfig = {} as SiteConfig;

	constructor(
		private customerService: CustomerService,
		private templateService: TemplateService,
		private notificationService: NotificationService,
		private titleService: Title,
		private loadingService: LoadingService,
		public sharedDataService: SharedDataService,
		public dialogService: DialogService,
	) {
		this.titleService.setTitle("Templates");
		this.siteConfig = this.sharedDataService.siteData();
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
					this.selectedTemplate = this.siteConfig?.websiteSettings?.templateId;

					const templateWithoutSelected = response.data.filter(
						(template: any) => template.templateKey !== this.selectedTemplate,
					);
					const templateSelected = response.data.filter(
						(template: any) => template.templateKey === this.selectedTemplate,
					);

					const templatesFiltered = [...templateSelected, ...templateWithoutSelected];
					this.templatesSubject.next(templatesFiltered);
				}
			},
			error: (error) => {
				this.notificationService.showError("Error occurred while getting templates");
			},
			complete: () => {
				this.loadingService.loadingOff();
			},
		});
	}

	setTemplate(template: TemplateModel) {
		if (template && template.templateKey) {
			this.loadingService.loadingOn();
			const params = {
				templateKey: template.templateKey,
			};
			this.customerService.changeTemplate(params).subscribe({
				next: (v) => {
					this.selectedTemplate = template.templateKey;
					this.customerService.getProfile();
				},
				error: (e) => {
					this.notificationService.showError(
						e.error.message || "Something went wrong while changing template.",
					);
				},
				complete: () => {
					this.notificationService.showSuccess("Template changed successfully");
					this.loadingService.loadingOff();
				},
			});
		} else {
			this.notificationService.showSuccess("Select template to apply.");
		}
	}

	previewTemplate(template: TemplateModel) {
		const ref = this.dialogService.open(TemplatePreviewComponent, {
			header: "Preview",
			modal: true,
			closable: true,
			width: "80%",
			data: {
				template: template,
			},
		});
		ref?.onClose.subscribe((setTemplate: boolean) => {
			if (setTemplate) {
				this.setTemplate(template);
			}
		});
	}
}
