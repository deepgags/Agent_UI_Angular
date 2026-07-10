import { CommonModule } from "@angular/common";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConfirmationService, TreeNode } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TabsModule } from "primeng/tabs";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { TreeModule } from "primeng/tree";
import { MenuItem, MenuType } from "../../../models/MenuItem";
import { Page } from "../../../models/Page";
import { LoadingService } from "../../../services/loading.service";
import { MenuService } from "../../../services/menu.service";
import { NotificationService } from "../../../services/notification.service";
import { PageService } from "../../../services/page.service";

@Component({
	selector: "app-menu-manager",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		DialogModule,
		ButtonModule,
		InputTextModule,
		SelectModule,
		TabsModule,
		TextareaModule,
		ConfirmDialogModule,
		ToastModule,
		TreeModule,
		DragDropModule,
	],
	templateUrl: "./menu-manager.component.html",
	styleUrl: "./menu-manager.component.scss",
	providers: [ConfirmationService],
})
export class MenuManagerComponent implements OnInit {
	mainMenuItems: MenuItem[] = [];
	sideMenuItems: MenuItem[] = [];
	mainMenuNested: MenuItem[] = [];
	sideMenuTree: TreeNode<MenuItem>[] = [];
	savingMenuOrder = false;

	menuDialogVisible = false;
	menuForm!: FormGroup;
	editingItem: MenuItem | null = null;

	menuTypes = [
		{ label: "Page", value: MenuType.PAGE },
		{ label: "Link", value: MenuType.LINK },
	];
	menuCategories = [
		{ label: "Main Menu", value: "main" },
		{ label: "Side Menu", value: "side" },
	];

	pages: Page[] = [];

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private menuService: MenuService,
		private pageService: PageService,
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService,
	) {}

	ngOnInit() {
		this.initializeForm();
		this.loadMenus();
		this.loadPages();
	}

	private initializeForm() {
		this.menuForm = this.fb.group({
			name: new FormControl("", [Validators.required]),
			menuType: new FormControl(MenuType.PAGE, [Validators.required]),
			menuCategory: new FormControl("main", [Validators.required]),
			pageKey: new FormControl(""),
			linkUrl: new FormControl(""),
			parentId: new FormControl(""),
		});

		this.menuForm.get("menuType")?.valueChanges.subscribe((type) => {
			this.updateFormValidation(type as MenuType);
		});

		this.updateFormValidation(this.menuForm.get("menuType")?.value as MenuType);

		this.menuForm.get("menuCategory")?.valueChanges.subscribe((newCategory) => {
			this.menuForm.patchValue({ parentId: "" });
			this.validateParentSelection(newCategory);
		});

		this.menuForm.get("parentId")?.valueChanges.subscribe((parentId) => {
			if (parentId && !this.isValidParent(parentId, this.menuForm.value.menuCategory)) {
				this.menuForm.patchValue({ parentId: "" });
			}
		});
	}

	private updateFormValidation(type: MenuType) {
		const pageKeyControl = this.menuForm.get("pageKey");
		const linkUrlControl = this.menuForm.get("linkUrl");

		if (type === MenuType.PAGE) {
			pageKeyControl?.setValidators([Validators.required]);
			linkUrlControl?.clearValidators();
			linkUrlControl?.setValue("");
		} else {
			linkUrlControl?.setValidators([Validators.required]);
			pageKeyControl?.clearValidators();
			pageKeyControl?.setValue("");
		}

		pageKeyControl?.updateValueAndValidity();
		linkUrlControl?.updateValueAndValidity();
	}

	private loadMenus() {
		this.menuService.getMenu().subscribe({
			next: (response) => {
				this.mainMenuItems = response.mainMenu || [];
				this.sideMenuItems = response.sideMenu || [];
				this.buildTrees();
			},
			error: () => {
				this.notificationService.showError("Failed to load menu items");
			},
		});
	}

	private loadPages() {
		this.pageService.getPages().subscribe({
			next: (pages) => {
				this.pages = pages;
				this.loadingService.loadingOff();
			},
			error: () => {
				this.notificationService.showError("Failed to load pages");
				this.loadingService.loadingOff();
			},
		});
	}

	private buildTrees() {
		this.mainMenuNested = this.buildNestedMenu(this.mainMenuItems);
		this.sideMenuTree = this.buildTree(this.sideMenuItems);
	}

	private buildNestedMenu(items: MenuItem[]): MenuItem[] {
		const childrenMap = new Map<string, MenuItem[]>();

		items.forEach((item) => {
			if (item.parentId) {
				if (!childrenMap.has(item.parentId)) {
					childrenMap.set(item.parentId, []);
				}
				childrenMap.get(item.parentId)!.push(item);
			}
		});

		const build = (item: MenuItem): MenuItem => {
			item.children = (childrenMap.get(item._id) || [])
				.slice()
				.sort((a, b) => a.order - b.order)
				.map(build);
			return item;
		};

		return items
			.filter((item) => !item.parentId)
			.sort((a, b) => a.order - b.order)
			.map(build);
	}

	private buildTree(items: MenuItem[]): TreeNode<MenuItem>[] {
		const childrenMap = new Map<string, MenuItem[]>();

		// Group items by parent
		items.forEach((item) => {
			if (item.parentId) {
				if (!childrenMap.has(item.parentId)) {
					childrenMap.set(item.parentId, []);
				}
				childrenMap.get(item.parentId)!.push(item);
			}
		});

		const buildNode = (item: MenuItem): TreeNode<MenuItem> => ({
			label: item.name,
			data: item,
			expanded: item.isExpanded || false,
			leaf: !childrenMap.has(item._id),
			children: (childrenMap.get(item._id) || []).sort((a, b) => a.order - b.order).map(buildNode),
		});

		return items
			.filter((item) => !item.parentId)
			.sort((a, b) => a.order - b.order)
			.map(buildNode);
	}

	getParentOptions(category: string): { label: string; value: string }[] {
		const options = [{ label: "No Parent (Top Level)", value: "" }];
		const items = category === "main" ? this.mainMenuItems : this.sideMenuItems;

		items.forEach((item) => {
			options.push({ label: item.name, value: item._id });
		});

		return options;
	}

	private validateParentSelection(category: string): void {
		const currentParentId = this.menuForm.value.parentId;
		if (currentParentId && !this.isValidParent(currentParentId, category)) {
			this.menuForm.patchValue({ parentId: "" });
		}
	}

	private isValidParent(parentId: string, category: string): boolean {
		const items = category === "main" ? this.mainMenuItems : this.sideMenuItems;
		return items.some((item) => item._id === parentId);
	}

	openAddMenuDialog() {
		this.editingItem = null;
		this.resetForm();
		this.menuDialogVisible = true;
	}

	openEditMenuDialog(item: MenuItem) {
		this.editingItem = item;
		this.menuForm.patchValue({
			name: item.name,
			menuType: item.menuType,
			menuCategory: item.menuCategory,
			pageKey: item.pageKey || "",
			linkUrl: item.linkUrl || "",
			parentId: item.parentId || "",
		});
		this.updateFormValidation(item.menuType);
		this.menuDialogVisible = true;
	}

	private resetForm() {
		this.menuForm.reset({
			menuType: MenuType.PAGE,
			menuCategory: "main",
			parentId: "",
		});
		this.updateFormValidation(MenuType.PAGE);
	}

	saveMenuItem() {
		if (!this.menuForm.valid) {
			this.menuForm.markAllAsTouched();
			return;
		}

		const formValue = this.menuForm.value;
		const menuItem: any = {
			name: formValue.name,
			menuType: formValue.menuType,
			menuCategory: formValue.menuCategory,
			order: this.editingItem?.order || this.getNextOrder(formValue.menuCategory),
			...(formValue.menuType === MenuType.PAGE ? { pageKey: formValue.pageKey } : { linkUrl: formValue.linkUrl }),
			...(formValue.parentId ? { parentId: formValue.parentId } : {}),
		};

		this.loadingService.loadingOn();

		const operation =
			this.editingItem ?
				this.menuService.updateMenuItem(this.editingItem._id, menuItem)
			:	this.menuService.createMenuItem(menuItem);

		operation.subscribe({
			next: (result) => {
				this.updateMenuData(result);
				this.buildTrees();
				this.notificationService.showSuccess(
					`Menu item ${this.editingItem ? "updated" : "created"} successfully`,
				);
				this.loadingService.loadingOff();
				this.menuDialogVisible = false;
			},
			error: (error) => {
				const errorMessage =
					(error as any)?.error?.message ||
					(error as any)?.message ||
					`Failed to ${this.editingItem ? "update" : "create"} menu item`;
				this.notificationService.showError(errorMessage);
				this.loadingService.loadingOff();
			},
		});
	}

	private getNextOrder(category: string): number {
		const items = category === "main" ? this.mainMenuItems : this.sideMenuItems;
		return items.length;
	}

	private updateMenuData(item: MenuItem) {
		const targetArray = item.menuCategory === "main" ? this.mainMenuItems : this.sideMenuItems;

		if (this.editingItem) {
			// Update existing item
			const index = targetArray.findIndex((i) => i._id === item._id);
			if (index !== -1) {
				targetArray[index] = item;
			}
		} else {
			// Add new item
			targetArray.push(item);
		}
	}

	deleteMenuItem(item: MenuItem) {
		this.confirmationService.confirm({
			header: "Delete Menu Item",
			message: `Are you sure you want to delete "${item.name}"?`,
			accept: () => this.confirmDelete(item),
		});
	}

	private confirmDelete(item: MenuItem) {
		this.loadingService.loadingOn();

		this.menuService.deleteMenuItem(item._id).subscribe({
			next: () => {
				const targetArray = item.menuCategory === "main" ? this.mainMenuItems : this.sideMenuItems;
				const index = targetArray.findIndex((i) => i._id === item._id);
				if (index !== -1) {
					targetArray.splice(index, 1);
				}
				this.buildTrees();
				this.notificationService.showSuccess("Menu item deleted successfully");
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to delete menu item");
				this.loadingService.loadingOff();
			},
		});
	}

	toggleNodeExpansion(node: TreeNode<MenuItem>) {
		node.expanded = !node.expanded;
		if (node.data) {
			node.data.isExpanded = node.expanded;
		}
	}

	onMenuDrop(event: CdkDragDrop<MenuItem[]>, parentId: string | null) {
		const list = this.getSiblingArray(parentId);
		if (!list || event.previousIndex === event.currentIndex) {
			return;
		}

		moveItemInArray(list, event.previousIndex, event.currentIndex);
		const menuItems = list.map((item, index) => {
			item.order = index;
			return { id: item._id, order: index };
		});

		this.savingMenuOrder = true;
		this.menuService.reorderMenuItems(menuItems).subscribe({
			next: () => {
				this.notificationService.showSuccess("Menu order updated successfully");
				this.savingMenuOrder = false;
			},
			error: (error: any) => {
				this.loadMenus();
				this.notificationService.showError(error?.error?.message || "Failed to reorder menu items");
				this.savingMenuOrder = false;
			},
		});
	}

	private getSiblingArray(parentId: string | null): MenuItem[] | null {
		if (parentId === null) {
			return this.mainMenuNested;
		}
		const find = (items: MenuItem[]): MenuItem[] | null => {
			for (const item of items) {
				if (item._id === parentId) {
					return item.children ?? [];
				}
				if (item.children?.length) {
					const result = find(item.children);
					if (result) {
						return result;
					}
				}
			}
			return null;
		};
		return find(this.mainMenuNested);
	}

	cancelDialog() {
		this.menuDialogVisible = false;
		this.editingItem = null;
	}
}
