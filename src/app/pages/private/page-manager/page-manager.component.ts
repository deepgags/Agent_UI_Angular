import { CommonModule, DatePipe } from "@angular/common";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { EditorModule } from "primeng/editor";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { EditorComponent } from "@tinymce/tinymce-angular";
import "tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import { environment } from "../../../environments/environment.development";
import { CreatePageRequest, Page, UpdatePageRequest } from "../../../models/Page";
import { BlobToUrlPipe } from "../../../pipes/blob-to-url";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";
import { PageService } from "../../../services/page.service";

@Component({
	selector: "app-page-manager",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		DialogModule,
		ButtonModule,
		SelectModule,
		InputTextModule,
		TextareaModule,
		ConfirmDialogModule,
		ToastModule,
		TableModule,
		EditorComponent,
		FileUploadModule,
		TabsModule,
		DragDropModule,
		BlobToUrlPipe,
		DatePipe,
		TooltipModule,
		EditorModule,
	],
	templateUrl: "./page-manager.component.html",
	styleUrl: "./page-manager.component.scss",
	providers: [ConfirmationService],
})
export class PageManagerComponent implements OnInit {
	pages: Page[] = [];
	pageDialogVisible = false;
	pageForm!: FormGroup;
	editingPage: Page | null = null;
	heroImages: string[] = [];
	uploadedFiles: File[] = [];
	localImageBaseUrl = environment.localImageUrl;
	editorReady = false;
	@ViewChild("fileUpload") fileUpload: any;

	tinymceConfig = {
		base_url: "/tinymce",
		suffix: ".min",
		plugins:
			"advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
		toolbar:
			"undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | code fullscreen | removeformat help",
		height: 380,
		menubar: true,
		branding: false,
		promotion: false,
		image_advtab: true,
		table_default_styles: {
			"border-collapse": "collapse",
			width: "100%",
		},
		table_default_attributes: {
			border: "1",
		},
		file_picker_types: "image",
		file_picker_callback: (cb: any, value: any, meta: any) => {
			const input = document.createElement("input");
			input.setAttribute("type", "file");
			input.setAttribute("accept", "image/*");
			input.addEventListener("change", (e: any) => {
				const file = e.target.files[0];
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					const id = "blobid" + new Date().getTime();
					const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
					const base64 = (reader.result as string).split(",")[1];
					const blobInfo = blobCache.create(id, file, base64);
					blobCache.add(blobInfo);
					cb(blobInfo.blobUri(), { title: file.name });
				});
				reader.readAsDataURL(file);
			});
			input.click();
		},
	};

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private pageService: PageService,
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService,
		private router: Router,
	) {}

	ngOnInit() {
		this.initializeForm();
		this.getPages();
	}

	private initializeForm() {
		this.pageForm = this.fb.group({
			title: new FormControl("", [Validators.required]),
			content: new FormControl("", [Validators.required]),
			metaTitle: new FormControl(""),
			metaDescription: new FormControl(""),
			keywords: new FormControl(""),
			homeSectionText1: new FormControl(""),
			homeSectionText2: new FormControl(""),
			homeSectionText3: new FormControl(""),
			homeSectionText4: new FormControl(""),
		});
	}

	private getPages() {
		this.loadingService.loadingOn();
		this.pageService.getPages().subscribe({
			next: (pages: Page[]) => {
				this.pages = pages;
				this.loadingService.loadingOff();
			},
			error: () => {
				this.notificationService.showError("Failed to load pages");
				this.loadingService.loadingOff();
			},
		});
	}

	openAddPageDialog() {
		this.editingPage = null;
		this.pageForm.reset();
		this.editorReady = true;
		this.pageDialogVisible = true;
	}

	openEditPageDialog(page: Page) {
		this.editingPage = page;
		this.heroImages = [];
		this.uploadedFiles = [];
		this.editorReady = false;
		this.pageDialogVisible = true;

		setTimeout(() => {
			this.pageForm.patchValue({
				title: page.title,
				content: page.content,
				metaTitle: page.metaTitle || "",
				metaDescription: page.metaDescription || "",
				keywords: page.keywords || "",
				homeSectionText1: page.homeSectionText1 || "",
				homeSectionText2: page.homeSectionText2 || "",
				homeSectionText3: page.homeSectionText3 || "",
				homeSectionText4: page.homeSectionText4 || "",
			});
			if (page.isEditable) {
				this.pageForm.get("content")?.enable();
			} else {
				this.pageForm.get("content")?.disable();
			}

			if (this.canManageHeroImages(page)) {
				this.loadHeroImages(page._id);
			}
			this.editorReady = true;
		}, 150);
	}

	savePage() {
		if (this.pageForm.valid) {
			const formValue = this.pageForm.getRawValue();
			const pageData: CreatePageRequest | UpdatePageRequest = {
				title: formValue.title,
				content: this.normalizeEditorHtmlSpaces(formValue.content),
				metaTitle: formValue.metaTitle,
				metaDescription: formValue.metaDescription,
				keywords: formValue.keywords,
			};

			if (this.isEditingHomePage()) {
				pageData.homeSectionText1 = this.normalizeEditorHtmlSpaces(formValue.homeSectionText1);
				pageData.homeSectionText2 = this.normalizeEditorHtmlSpaces(formValue.homeSectionText2);
				pageData.homeSectionText3 = this.normalizeEditorHtmlSpaces(formValue.homeSectionText3);
				pageData.homeSectionText4 = this.normalizeEditorHtmlSpaces(formValue.homeSectionText4);
			}

			this.loadingService.loadingOn();
			this.saveHeroImageChanges(pageData);
		} else {
			this.pageForm.markAllAsTouched();
		}
	}

	private normalizeEditorHtmlSpaces(content: string | null | undefined): string {
		if (!content) {
			return "";
		}

		return content.replace(/&nbsp;|&#160;/g, " ").replace(/ /g, " ");
	}

	private _savePageData(pageData: CreatePageRequest | UpdatePageRequest) {
		if (this.editingPage) {
			this.pageService.updatePage(this.editingPage._id, pageData).subscribe({
				next: (updatedPage) => {
					this.getPages();
					this.notificationService.showSuccess("Page updated successfully");
					this.loadingService.loadingOff();
					this.heroImages = [];
					this.uploadedFiles = [];
					this.fileUpload?.clear();
					this.pageDialogVisible = false;
				},
				error: (error) => {
					this.notificationService.showError(error.error?.message || "Failed to update page");
					this.loadingService.loadingOff();
				},
			});
		} else {
			(pageData as CreatePageRequest).siteId = "current-site";
			this.pageService.createPage(pageData as CreatePageRequest).subscribe({
				next: (createdPage) => {
					this.pages.push(createdPage);
					this.notificationService.showSuccess("Page created successfully");
					this.loadingService.loadingOff();
					this.heroImages = [];
					this.uploadedFiles = [];
					this.fileUpload?.clear();
					this.pageDialogVisible = false;
				},
				error: (error) => {
					this.notificationService.showError(error.error?.message || "Failed to create page");
					this.loadingService.loadingOff();
				},
			});
		}
	}

	private saveHeroImageChanges(pageData: CreatePageRequest | UpdatePageRequest) {
		if (!this.canManageHeroImages(this.editingPage) || !this.editingPage) {
			this._savePageData(pageData);
			return;
		}

		if (this.uploadedFiles.length === 0) {
			this._savePageData(pageData);
			return;
		}

		const fileLimit = this.getHeroImageLimit(this.editingPage);
		const filesToUpload = this.uploadedFiles.slice(0, fileLimit);
		this.pageService.uploadHeroImages(this.editingPage._id, filesToUpload).subscribe({
			next: (images: string[]) => {
				this.heroImages = images;
				this.uploadedFiles = [];
				this._savePageData(pageData);
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to upload hero images");
				this.loadingService.loadingOff();
			},
		});
	}

	deletePage(page: Page) {
		if (!page.isDeletable) {
			this.notificationService.showError("This page cannot be deleted");
			return;
		}

		this.confirmationService.confirm({
			header: "Delete Page",
			message: `Do you want to delete "${page.title}"?`,
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
				this._confirmDeletePage(page);
			},
			reject: () => {},
		});
	}

	private _confirmDeletePage(page: Page) {
		this.loadingService.loadingOn();
		this.pageService.deletePage(page._id).subscribe({
			next: () => {
				this.pages = this.pages.filter((p) => p._id !== page._id);
				this.notificationService.showSuccess("Page deleted successfully");
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to delete page");
				this.loadingService.loadingOff();
			},
		});
	}

	private loadHeroImages(pageId: string) {
		this.pageService.getHeroImages(pageId).subscribe({
			next: (images: string[]) => {
				this.heroImages = images;
			},
			error: (error) => {
				this.notificationService.showError("Failed to load hero images");
			},
		});
	}

	onHeroImageDrop(event: CdkDragDrop<string[]>): void {
		if (!this.editingPage) return;

		const previousOrder = [...this.heroImages];
		moveItemInArray(this.heroImages, event.previousIndex, event.currentIndex);

		const newOrder = this.heroImages.map((image) => previousOrder.indexOf(image));
		this.pageService.reorderHeroImages(this.editingPage._id, newOrder).subscribe({
			next: (images: string[]) => {
				this.heroImages = images;
			},
			error: (error) => {
				this.heroImages = previousOrder;
				this.notificationService.showError(error.error?.message || "Failed to reorder hero images");
			},
		});
	}

	onFileSelect(event: any) {
		const files = event.files;
		if (!files || files.length === 0) {
			this.notificationService.showError("No files selected");
			return;
		}

		const maxSize = 5 * 1024 * 1024;
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

		for (const file of files) {
			if (!file) continue;

			if (file.size > maxSize) {
				this.notificationService.showError(`File ${file.name} is too large. Maximum size is 5MB.`);
				return;
			}
			if (!allowedTypes.includes(file.type)) {
				this.notificationService.showError(`Invalid File ${file.name}. Only images are allowed.`);
				return;
			}
		}

		const fileLimit = this.getHeroImageLimit(this.editingPage);
		if (files.length > fileLimit) {
			this.notificationService.showError(`Please select up to ${fileLimit} image${fileLimit > 1 ? "s" : ""}.`);
			return;
		}

		if (this.heroImages.length + files.length > fileLimit) {
			this.notificationService.showError(`Maximum ${fileLimit} hero image${fileLimit > 1 ? "s" : ""} allowed.`);
			return;
		}

		this.uploadedFiles = [...files];
	}

	removeSelectedFile(index: number) {
		this.uploadedFiles.splice(index, 1);
	}

	canManageHeroImages(page?: Page | null): boolean {
		if (!page) {
			return false;
		}
		return page.allowHeroImage === true;
	}

	isEditingHomePage(): boolean {
		return this.editingPage?.pageKey === "home";
	}

	getHeroImageLimit(page?: Page | null): number {
		if (!page || !page.allowHeroImage) {
			return 0;
		}
		if (page.heroImageLimit && page.heroImageLimit > 0) {
			return page.heroImageLimit;
		}
		return page.pageKey === "home" ? 5 : 1;
	}

	deleteHeroImage(imageIndex: number) {
		if (!this.editingPage) return;

		this.confirmationService.confirm({
			header: "Delete Hero Image",
			message: "Do you want to delete this hero image?",
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
				this._confirmDeleteHeroImage(imageIndex);
			},
			reject: () => {},
		});
	}

	private _confirmDeleteHeroImage(imageIndex: number) {
		if (!this.editingPage) return;

		this.loadingService.loadingOn();
		this.pageService.deleteHeroImage(this.editingPage._id, imageIndex).subscribe({
			next: (images: string[]) => {
				this.heroImages = images;
				this.notificationService.showSuccess("Hero image deleted successfully");
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to delete hero image");
				this.loadingService.loadingOff();
			},
		});
	}

	cancelDialog() {
		this.pageDialogVisible = false;
		this.editingPage = null;
		this.heroImages = [];
		this.uploadedFiles = [];
		this.editorReady = false;
		this.fileUpload?.clear();
	}

	getStatusBadge(page: Page) {
		if (page.isPredefined && !page.isEditable) {
			return { label: "Read Only", severity: "warning" };
		}
		if (page.isPredefined) {
			return { label: "Built-in", severity: "info" };
		}
		return { label: "Custom", severity: "success" };
	}

	getBadgeClass(page: Page): string {
		const { severity } = this.getStatusBadge(page);
		const map: Record<string, string> = {
			warning: "bg-warning text-dark",
			info: "bg-info text-dark",
			success: "bg-success",
		};
		return map[severity] ?? "bg-secondary";
	}

	getPageIcon(page: Page): string {
		const key = page.pageKey ?? "";
		const icons: Record<string, string> = {
			home: "bi-house-fill",
			about: "bi-person-fill",
			contact: "bi-envelope-fill",
			seller: "bi-tag-fill",
			buyer: "bi-search-heart",
			testimonial: "bi-chat-quote-fill",
			calculator: "bi-calculator-fill",
			cities: "bi-geo-alt-fill",
		};
		return icons[key] ?? "bi-file-earmark-text-fill";
	}

	getPageIconClass(page: Page): string {
		if (!page.isPredefined) return "page-icon-wrap page-icon-custom";
		const key = page.pageKey ?? "";
		if (key === "home") return "page-icon-wrap page-icon-home";
		if (["seller", "buyer"].includes(key)) return "page-icon-wrap page-icon-listing";
		if (key === "contact") return "page-icon-wrap page-icon-contact";
		return "page-icon-wrap page-icon-builtin";
	}

	previewPage(page: Page) {
		if (page.isPredefined) {
			window.open(this.router.serializeUrl(this.router.createUrlTree([page.pageKey])), "_blank");
		} else {
			this.router.navigate(["/page", page.slug]);
		}
	}
}
