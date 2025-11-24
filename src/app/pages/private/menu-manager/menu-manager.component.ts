import { CommonModule } from "@angular/common";
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
	],
	templateUrl: "./menu-manager.component.html",
	styleUrl: "./menu-manager.component.scss",
	providers: [ConfirmationService],
})
export class MenuManagerComponent implements OnInit {
	_mainMenuItems: MenuItem[] = [];
	_sideMenuItems: MenuItem[] = [];
	mainMenuItems: MenuItem[] = [];
	mainTreeNodes: TreeNode<MenuItem>[] = [];
	sideMenuItems: MenuItem[] = [];
	sideTreeNodes: TreeNode<MenuItem>[] = [];
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
		private confirmationService: ConfirmationService
	) {}

	ngOnInit() {
		this.initializeForm();
		this.loadMenuItems();
		this.getPages();
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
			this.onMenuTypeChange(type);
		});
	}

	private onMenuTypeChange(type: MenuType) {
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

	private loadMenuItems() {
		this.menuService.getMenu().subscribe({
			next: (menuData: { mainMenu: MenuItem[]; sideMenu: MenuItem[] }) => {
				this._mainMenuItems = menuData.mainMenu;
				this._sideMenuItems = menuData.sideMenu;
				this.buildMenus();
			},
			error: () => {
				this.notificationService.showError("Failed to load menu items");
			},
		});
	}

	private getPages() {
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
		// this.pageService.getPages().subscribe({
		// 	next: (pages: PredefinedPage[]) => {
		// 		this.pages = pages;
		// 	},
		// 	error: () => {
		// 		this.notificationService.showError("Failed to load predefined pages");
		// 	},
		// });
	}

	getAvailableParents(menuCategory: string): { label: string; value: string }[] {
		const options = [{ label: "No Parent (Top Level)", value: "" }];
		const menuItems = menuCategory === "main" ? this._mainMenuItems : this._sideMenuItems;
		menuItems.forEach((item) => {
			if (this.editingItem && item._id === this.editingItem._id) return;
			options.push({ label: item.name, value: item._id });
		});
		return options;
	}

	openAddMenuDialog() {
		this.editingItem = null;
		this.menuForm.reset({
			menuType: MenuType.PAGE,
		});
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
		this.menuDialogVisible = true;
	}

	saveMenuItem() {
		if (this.menuForm.valid) {
			const formValue = this.menuForm.value;
			const menuItem = {
				name: formValue.name,
				menuType: formValue.menuType,
				menuCategory: formValue.menuCategory,
				pageKey: formValue.pageKey,
				linkUrl: formValue.linkUrl,
				order:
					this.editingItem?.order ||
					(formValue.menuCategory === "main" ? this._mainMenuItems.length : this._sideMenuItems.length),
				parentId: formValue.parentId || "",
			};

			this.loadingService.loadingOn();

			if (this.editingItem) {
				// Update existing item
				this.menuService.updateMenuItem(this.editingItem._id, menuItem).subscribe({
					next: (updatedItem) => {
						if (updatedItem.menuCategory === "main") {
							const index = this._mainMenuItems.findIndex((item) => item._id === this.editingItem!._id);
							if (index !== -1) {
								this._mainMenuItems[index] = updatedItem;
							}
						} else {
							const index = this._sideMenuItems.findIndex((item) => item._id === this.editingItem!._id);
							if (index !== -1) {
								this._sideMenuItems[index] = updatedItem;
							}
						}
						this.buildMenus();
						this.notificationService.showSuccess("Menu item updated successfully");
						this.loadingService.loadingOff();
						this.menuDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || "Failed to update menu item");
						this.loadingService.loadingOff();
					},
				});
			} else {
				// Create new item
				this.menuService.createMenuItem(menuItem).subscribe({
					next: (createdItem) => {
						if (createdItem.menuCategory === "main") {
							this._mainMenuItems.push(createdItem);
						} else {
							this._sideMenuItems.push(createdItem);
						}
						this.buildMenus();
						this.notificationService.showSuccess("Menu item created successfully");
						this.loadingService.loadingOff();
						this.menuDialogVisible = false;
					},
					error: (error) => {
						this.notificationService.showError(error.error?.message || "Failed to create menu item");
						this.loadingService.loadingOff();
					},
				});
			}
		} else {
			this.menuForm.markAllAsTouched();
		}
	}

	deleteMenuItem(item: MenuItem) {
		this.confirmationService.confirm({
			header: "Delete Menu Item",
			message: `Do you want to delete "${item.name}"?`,
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
				this._confirmDeleteMenuItem(item);
			},
			reject: () => {},
		});
	}

	private _confirmDeleteMenuItem(item: MenuItem) {
		this.loadingService.loadingOn();
		this.menuService.deleteMenuItem(item._id).subscribe({
			next: () => {
				if (item.menuCategory === "main") {
					this._mainMenuItems = this._mainMenuItems.filter((menuItem) => menuItem._id !== item._id);
				} else {
					this._sideMenuItems = this._sideMenuItems.filter((menuItem) => menuItem._id !== item._id);
				}
				this.buildMenus();
				this.notificationService.showSuccess("Menu item deleted successfully");
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to delete menu item");
				this.loadingService.loadingOff();
			},
		});
	}

	private buildMenus() {
		this.buildMenuForCategory(this._mainMenuItems, this.mainMenuItems, this.mainTreeNodes);
		this.buildMenuForCategory(this._sideMenuItems, this.sideMenuItems, this.sideTreeNodes);
	}

	private buildMenuForCategory(
		menuItems: MenuItem[],
		menuItemsArray: MenuItem[],
		treeNodesArray: TreeNode<MenuItem>[]
	) {
		const childrenMap = new Map<string, MenuItem[]>();
		// Build children map
		for (const item of menuItems) {
			if (item.parentId) {
				if (!childrenMap.has(item.parentId)) {
					childrenMap.set(item.parentId, []);
				}
				childrenMap.get(item.parentId)!.push(item);
			}
		}

		// Build tree for root items
		const _processedMenuItems: MenuItem[] = [];
		for (const item of menuItems) {
			if (!item.parentId) {
				_processedMenuItems.push({
					...item,
					children: this.buildChildren(item._id, childrenMap),
					isExpanded: item.isExpanded || false,
				});
			}
		}

		menuItemsArray.splice(0, menuItemsArray.length, ..._processedMenuItems);
		treeNodesArray.splice(0, treeNodesArray.length, ...this.convertToTreeNodes(_processedMenuItems));
	}

	private buildChildren(parentId: string, childrenMap: Map<string, MenuItem[]>): MenuItem[] {
		const children = childrenMap.get(parentId) || [];
		return children
			.sort((a, b) => a.order - b.order)
			.map((child) => ({
				...child,
				children: this.buildChildren(child._id, childrenMap),
				isExpanded: child.isExpanded || false,
			}));
	}

	private convertToTreeNodes(items: MenuItem[]): TreeNode<MenuItem>[] {
		return items.map((item) => ({
			label: item.name,
			data: item,
			// icon: "bi bi-caret-right-fill",
			expanded: item.isExpanded || false,
			leaf: !item.children || item.children.length === 0,
			children: item.children ? this.convertToTreeNodes(item.children) : [],
		}));
	}

	private flattenTree(items: MenuItem[]): MenuItem[] {
		let flat: MenuItem[] = [];
		items.forEach((item) => {
			flat.push({ ...item, children: undefined });
			if (item.children && item.children.length > 0) {
				flat = flat.concat(this.flattenTree(item.children));
			}
		});
		return flat;
	}

	toggleExpand(item: MenuItem) {
		item.isExpanded = !item.isExpanded;
	}

	toggleNodeExpansion(node: TreeNode<MenuItem>) {
		node.expanded = !node.expanded;
		if (node.data) {
			node.data.isExpanded = node.expanded;
		}
	}

	cancelDialog() {
		this.menuDialogVisible = false;
		this.editingItem = null;
	}
}
