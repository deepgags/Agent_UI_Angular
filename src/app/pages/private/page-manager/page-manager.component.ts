import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { EditorModule } from "primeng/editor";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { CreatePageRequest, Page, UpdatePageRequest } from "../../../models/Page";
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
		EditorModule,
		DatePipe,
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

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private pageService: PageService,
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService
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
		this.pageDialogVisible = true;
	}

	openEditPageDialog(page: Page) {
		this.editingPage = page;
		this.pageForm.patchValue({
			title: page.title,
			content: page.content,
			metaTitle: page.metaTitle || "",
			metaDescription: page.metaDescription || "",
			keywords: page.keywords || "",
		});
		this.pageDialogVisible = true;
	}

	savePage() {
		if (this.pageForm.valid) {
			const formValue = this.pageForm.value;
			const pageData: CreatePageRequest | UpdatePageRequest = {
				title: formValue.title,
				content: formValue.content,
				metaTitle: formValue.metaTitle,
				metaDescription: formValue.metaDescription,
				keywords: formValue.keywords,
			};

			this.loadingService.loadingOn();

			if (this.editingPage) {
				this.pageService.updatePage(this.editingPage._id, pageData).subscribe({
					next: (updatedPage) => {
						const index = this.pages.findIndex((p) => p._id === this.editingPage!._id);
						if (index !== -1) {
							this.pages[index] = updatedPage;
						}
						this.notificationService.showSuccess("Page updated successfully");
						this.loadingService.loadingOff();
						this.pageDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || "Failed to update page");
						this.loadingService.loadingOff();
					},
				});
			} else {
				(pageData as CreatePageRequest).siteId = "current-site"; // TODO: Get from user context
				this.pageService.createPage(pageData as CreatePageRequest).subscribe({
					next: (createdPage) => {
						this.pages.push(createdPage);
						this.notificationService.showSuccess("Page created successfully");
						this.loadingService.loadingOff();
						this.pageDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || "Failed to create page");
						this.loadingService.loadingOff();
					},
				});
			}
		} else {
			this.pageForm.markAllAsTouched();
		}
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

	cancelDialog() {
		this.pageDialogVisible = false;
		this.editingPage = null;
	}

	getStatusBadge(page: Page) {
		if (!page.isEditable) return { label: "Read Only", severity: "info" };
		if (!page.isDeletable) return { label: "Protected", severity: "warning" };
		return { label: "Editable", severity: "success" };
	}
}
