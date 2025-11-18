import { CommonModule } from "@angular/common";
import { Component, OnInit, signal, Signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConfirmationService, TreeNode } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { OrderListModule } from "primeng/orderlist";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { TreeModule } from "primeng/tree";
import { MenuItem, MenuType, PredefinedPage } from "../../../models/MenuItem";
import { LoadingService } from "../../../services/loading.service";
import { MenuService } from "../../../services/menu.service";
import { NotificationService } from "../../../services/notification.service";

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
		TextareaModule,
		OrderListModule,
		ConfirmDialogModule,
		ToastModule,
		TreeModule,
	],
	templateUrl: "./menu-manager.component.html",
	styleUrl: "./menu-manager.component.scss",
	providers: [ConfirmationService],
})
export class MenuManagerComponent implements OnInit {
	_menuItemsCore: MenuItem[] = [];
	menuItems = signal<MenuItem[]>([]);
	treeNodes = signal<TreeNode<MenuItem>[]>([]);
	menuDialogVisible = false;
	menuForm!: FormGroup;
	editingItem: MenuItem | null = null;
	menuTypes = [
		{ label: "Page", value: MenuType.PAGE },
		{ label: "Link", value: MenuType.LINK },
	];

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private menuService: MenuService,
		private notificationService: NotificationService,
		private confirmationService: ConfirmationService
	) {}

	ngOnInit() {
		this.initializeForm();
		this.loadMenuItems();
		this.loadPredefinedPages();
	}

	private initializeForm() {
		this.menuForm = this.fb.group({
			name: new FormControl("", [Validators.required]),
			pageMetaTitle: new FormControl(""),
			metaDescription: new FormControl(""),
			keywords: new FormControl(""),
			menuType: new FormControl(MenuType.PAGE, [Validators.required]),
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
			next: (menuItems: MenuItem[]) => {
				this._menuItemsCore = menuItems;
				this.buildMenu();
			},
			error: () => {
				this.notificationService.showError("Failed to load menu items");
			},
		});
	}

	predefinedPages: PredefinedPage[] = [];

	private loadPredefinedPages() {
		this.menuService.getPredefinedPages().subscribe({
			next: (pages: PredefinedPage[]) => {
				this.predefinedPages = pages;
			},
			error: () => {
				this.notificationService.showError("Failed to load predefined pages");
			},
		});
	}

	getAvailableParents(): { label: string; value: string }[] {
		const options = [{ label: "No Parent (Top Level)", value: "" }];
		this._menuItemsCore.forEach((item) => {
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
			pageMetaTitle: item.pageMetaTitle || "",
			metaDescription: item.metaDescription || "",
			keywords: item.keywords || "",
			menuType: item.menuType,
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
				pageMetaTitle: formValue.pageMetaTitle,
				metaDescription: formValue.metaDescription,
				keywords: formValue.keywords,
				menuType: formValue.menuType,
				pageKey: formValue.pageKey,
				linkUrl: formValue.linkUrl,
				order: this.editingItem?.order || this._menuItemsCore.length,
				parentId: formValue.parentId || "",
			};

			this.loadingService.loadingOn();

			if (this.editingItem) {
				// Update existing item
				this.menuService.updateMenuItem(this.editingItem._id, menuItem).subscribe({
					next: (updatedItem) => {
						const index = this._menuItemsCore.findIndex((item) => item._id === this.editingItem!._id);
						if (index !== -1) {
							this._menuItemsCore[index] = updatedItem;
						}
						this.buildMenu();
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
						this._menuItemsCore.push(createdItem);
						this.buildMenu();
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
				this._menuItemsCore = this._menuItemsCore.filter((menuItem) => menuItem._id !== item._id);
				this.updateOrderNumbers();
				this.buildMenu();
				this.notificationService.showSuccess("Menu item deleted successfully");
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to delete menu item");
				this.loadingService.loadingOff();
			},
		});
	}

	onReorder(event: any) {
		this.updateOrderNumbers();
		this.saveMenu();
	}

	private updateOrderNumbers() {
		this._menuItemsCore.forEach((item, index) => {
			item.order = index;
		});
	}

	private saveMenu() {
		this.loadingService.loadingOn();
		const flatMenuItems = this.flattenTree(this.menuItems());

		this.menuService.reorderMenuItems({ items: flatMenuItems }).subscribe({
			next: () => {
				this.notificationService.showSuccess("Menu updated successfully");
				this.loadingService.loadingOff();
			},
			error: (error) => {
				this.notificationService.showError(error.error?.message || "Failed to update menu");
				this.loadingService.loadingOff();
			},
		});
	}

	private buildMenu() {
		const childrenMap = new Map<string, MenuItem[]>();

		// Build children map
		for (const item of this._menuItemsCore) {
			if (item.parentId) {
				if (!childrenMap.has(item.parentId)) {
					childrenMap.set(item.parentId, []);
				}
				childrenMap.get(item.parentId)!.push(item);
			}
		}

		// Build tree for root items
		const _processedMenuItems: MenuItem[] = [];
		for (const item of this._menuItemsCore) {
			if (!item.parentId) {
				_processedMenuItems.push({
					...item,
					children: this.buildChildren(item._id, childrenMap),
					isExpanded: item.isExpanded || false,
				});
			}
		}

		this.menuItems.set(_processedMenuItems);
		this.treeNodes.set(this.convertToTreeNodes(_processedMenuItems));
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

	onNodeDrop(event: any) {
		console.log("Node dropped:", event);
		// Update the menu structure based on the drag-drop event
		// This will require updating parentId relationships
		this.updateMenuFromTreeNodes();
		this.saveMenu();
	}

	private updateMenuFromTreeNodes() {
		// Convert treeNodes back to flat menuItems with updated parent relationships
		const flatItems = this.flattenTreeNodes(this.treeNodes());
		this._menuItemsCore = flatItems;
		this.buildMenu();
	}

	private flattenTreeNodes(nodes: TreeNode<MenuItem>[], parentId?: string): MenuItem[] {
		let flat: MenuItem[] = [];

		nodes.forEach((node, index) => {
			const menuItem = {
				...node.data!,
				parentId: parentId,
				order: index,
				children: undefined, // Remove children for flat structure
			};
			flat.push(menuItem);

			if (node.children && node.children.length > 0) {
				flat = flat.concat(this.flattenTreeNodes(node.children, menuItem._id));
			}
		});

		return flat;
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
