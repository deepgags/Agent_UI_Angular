import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';

interface Menu {
  _id: string;
  name: string;
  menuType: 'page' | 'link';
  menuCategory: 'main' | 'side';
  pageKey?: string;
  linkUrl?: string;
  order?: number;
  parentId?: string;
  createdAt: string;
}

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, ToolbarModule, SelectModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss',
})
export class MenusComponent implements OnInit {
  customerId = input<string>();
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<Menu[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: Menu | null = null;
  searchQuery = '';
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);

  private getEndpoint(): string {
    return this.customerId() ? `/customers/${this.customerId()}/menus` : '/menus';
  }

  form = this.fb.group({
    name: ['', Validators.required],
    menuType: ['page', Validators.required],
    menuCategory: ['main'],
    pageKey: [''],
    linkUrl: [''],
    order: [0],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const endpoint = this.getEndpoint();
    const page = Math.floor(this.first() / this.rows()) + 1;
    this.apiClient.getPaginated<Menu>(endpoint, { page, pageSize: this.rows(), search: this.searchQuery }).subscribe({
      next: (res) => { this.items.set(res.data); this.totalRecords.set(res.meta?.total ?? res.data.length); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadItems();
  }

  onSearch() { this.first.set(0); this.loadItems(); }
  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: Menu) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ name: item.name, menuType: item.menuType, menuCategory: item.menuCategory, pageKey: item.pageKey, linkUrl: item.linkUrl, order: item.order }); this.dialogVisible = true; }

  deleteItem(item: Menu) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const endpoint = this.getEndpoint();
        this.apiClient.delete(`${endpoint}/${item._id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Menu deleted' }); this.loadItems(); },
        });
      },
    });
  }

  onSave() {
    if (this.form.invalid) return;
    const data = this.form.value;
    const endpoint = this.getEndpoint();
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`${endpoint}/${this.selectedItem._id}`, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Menu updated' }); this.dialogVisible = false; this.loadItems(); },
      });
    } else {
      this.apiClient.post(endpoint, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Menu created' }); this.dialogVisible = false; this.loadItems(); },
      });
    }
  }
}