import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface CustomerCity {
  _id: string;
  name: string;
  order?: number;
  image?: string;
  createdAt: string;
}

@Component({
  selector: 'app-customer-cities',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customer-cities.component.html',
  styleUrl: './customer-cities.component.scss',
})
export class CustomerCitiesComponent implements OnInit {
  customerId = input<string>();
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<CustomerCity[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: CustomerCity | null = null;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;

  private getEndpoint(): string {
    return `/customers/${this.customerId()}/cities`;
  }

  form = this.fb.group({
    name: ['', Validators.required],
    order: [1, Validators.min(1)],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const endpoint = this.getEndpoint();
    this.apiClient.getPaginated<CustomerCity>(endpoint, { page: this.currentPage, pageSize: this.pageSize, search: this.searchQuery }).subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch() { this.currentPage = 1; this.loadItems(); }
  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: CustomerCity) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ name: item.name, order: item.order }); this.dialogVisible = true; }

  deleteItem(item: CustomerCity) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const endpoint = this.getEndpoint();
        this.apiClient.delete(`${endpoint}/${item._id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City deleted' }); this.loadItems(); },
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
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City updated' }); this.dialogVisible = false; this.loadItems(); },
      });
    } else {
      this.apiClient.postFormData(endpoint, this.buildFormData(data)).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City created' }); this.dialogVisible = false; this.loadItems(); },
      });
    }
  }

  private buildFormData(data: any): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value as string);
      }
    });
    return formData;
  }
}