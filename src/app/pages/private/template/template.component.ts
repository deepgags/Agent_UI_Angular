import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
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
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: "./template.component.html",
	styleUrl: "./template.component.scss",
})
export class TemplateComponent implements OnInit {
	selectedTemplate: any = null;
	customerModel!: CustomerModel;
	siteConfig: SiteConfig = {} as SiteConfig;
	allTemplates: TemplateModel[] = [];
	searchQuery = "";

	constructor(
		private customerService: CustomerService,
		private templateService: TemplateService,
		private notificationService: NotificationService,
		private titleService: Title,
		private loadingService: LoadingService,
		public sharedDataService: SharedDataService,
		private router: Router,
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
					this.selectedTemplate = this.siteConfig?.websiteSettings?.templateId;
					const selected = response.data.filter((t: any) => t.templateKey === this.selectedTemplate);
					const rest = response.data.filter((t: any) => t.templateKey !== this.selectedTemplate);
					this.allTemplates = [...selected, ...rest];
				}
			},
			error: () => {
				this.notificationService.showError("Error occurred while getting templates");
			},
			complete: () => {
				this.loadingService.loadingOff();
			},
		});
	}

	get activeTemplate(): TemplateModel | undefined {
		return this.allTemplates.find((t) => t.templateKey === this.selectedTemplate);
	}

	get showHero(): boolean {
		return !this.searchQuery.trim() && !!this.activeTemplate;
	}

	get filteredTemplates(): TemplateModel[] {
		const query = this.searchQuery.toLowerCase().trim();
		if (!query) {
			return this.allTemplates.filter((t) => t.templateKey !== this.selectedTemplate);
		}
		return this.allTemplates.filter(
			(t) =>
				t.name.toLowerCase().includes(query) ||
				t.templateKey.toLowerCase().includes(query) ||
				(t.description || "").toLowerCase().includes(query),
		);
	}

	setTemplate(template: TemplateModel) {
		if (!template?.templateKey) {
			this.notificationService.showError("Select a template to apply.");
			return;
		}
		this.loadingService.loadingOn();
		this.customerService.changeTemplate({ templateKey: template.templateKey }).subscribe({
			next: () => {
				this.selectedTemplate = template.templateKey;
				const selected = this.allTemplates.filter((t) => t.templateKey === this.selectedTemplate);
				const rest = this.allTemplates.filter((t) => t.templateKey !== this.selectedTemplate);
				this.allTemplates = [...selected, ...rest];
				this.customerService.getProfile();
			},
			error: (e) => {
				this.notificationService.showError(e.error?.message || "Something went wrong while changing template.");
			},
			complete: () => {
				this.notificationService.showSuccess("Template applied successfully");
				this.loadingService.loadingOff();
			},
		});
	}

	previewTemplate(template: TemplateModel) {
		if (!template?.templateKey) {
			this.notificationService.showError("Template key is missing for preview.");
			return;
		}
		const url = this.router.serializeUrl(
			this.router.createUrlTree(["/home"], { queryParams: { templatePreview: template.templateKey } }),
		);
		window.open(url, "_blank");
	}
}
