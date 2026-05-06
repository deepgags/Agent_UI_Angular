import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  heroImage?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
})
export class PagesComponent implements OnInit {
  customerId = input<string>();
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<Page[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: Page | null = null;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;

  private getEndpoint(): string {
    return this.customerId() ? `/customers/${this.customerId()}/pages` : '/pages';
  }

  form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const endpoint = this.getEndpoint();
    const query: ListQuery = { page: this.currentPage, pageSize: this.pageSize, search: this.searchQuery };
    this.apiClient.getPaginated<Page>(endpoint, query).subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch() { this.currentPage = 1; this.loadItems(); }

  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }

  editItem(item: Page) { this.isEdit = true; this.selectedItem = item; this.form.patchValue(item); this.dialogVisible = true; }

  deleteItem(item: Page) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const endpoint = this.getEndpoint();
        this.apiClient.delete(`${endpoint}/${item.id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Page deleted' }); this.loadItems(); },
        });
      },
    });
  }

  onSave() {
    if (this.form.invalid) return;
    const data = this.form.value;
    const endpoint = this.getEndpoint();
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`${endpoint}/${this.selectedItem.id}`, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Page updated' }); this.dialogVisible = false; this.loadItems(); },
      });
    } else {
      this.apiClient.post(endpoint, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Page created' }); this.dialogVisible = false; this.loadItems(); },
      });
    }
  }
}