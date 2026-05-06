import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Property {
  _id: string;
  ListingKey?: string;
  UnparsedAddress?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  County?: string;
  ListPrice?: number;
  PropertyType?: string;
  PropertySubType?: string;
  BathroomsTotal?: number;
  BedroomsTotal?: number;
  LivingArea?: number;
  LotSizeAcres?: number;
  YearBuilt?: number;
  ContractStatus?: string;
  MlsName?: string;
  feed?: string;
  createdAt?: string;
  ModificationTimestamp?: string;
}

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, InputNumberModule, DialogModule, ConfirmDialogModule, ToastModule, ToolbarModule, SelectModule, TagModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<Property[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: Property | null = null;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;

  form = this.fb.group({
    UnparsedAddress: ['', Validators.required],
    City: [''],
    StateOrProvince: [''],
    PostalCode: [''],
    ListPrice: [0],
    PropertyType: [''],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const query: ListQuery = { page: this.currentPage, pageSize: this.pageSize, search: this.searchQuery };
    this.apiClient.getPaginated<Property>('/properties', query).subscribe({ next: (res) => { this.items.set(res.data); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  onSearch() { this.currentPage = 1; this.loadItems(); }
  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: Property) { this.isEdit = true; this.selectedItem = item; this.form.patchValue(item); this.dialogVisible = true; }

  deleteItem(item: Property) {
    this.confirmationService.confirm({ message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle', accept: () => {
      this.apiClient.delete(`/properties/${item._id}`).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property deleted' }); this.loadItems(); } });
    }});
  }

  onSave() {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`/properties/${this.selectedItem._id}`, data).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property updated' }); this.dialogVisible = false; this.loadItems(); } });
    }
  }

  getStatusSeverity(status: string | undefined) {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warn';
      case 'sold': return 'danger';
      case 'withdrawn': return 'info';
      default: return 'info';
    }
  }
}