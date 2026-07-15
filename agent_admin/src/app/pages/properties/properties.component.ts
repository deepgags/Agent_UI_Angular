import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
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
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, ToolbarModule, TagModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<Property[]>([]);
  loading = signal(false);
  searchQuery = '';
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const page = Math.floor(this.first() / this.rows()) + 1;
    const query: ListQuery = { page, pageSize: this.rows(), search: this.searchQuery };
    this.apiClient.getPaginated<Property>('/properties', query).subscribe({ next: (res) => { this.items.set(res.data); this.totalRecords.set(res.meta?.total ?? res.data.length); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadItems();
  }

  onSearch() { this.first.set(0); this.loadItems(); }

  onRowClick(property: Property) {
    if (property?._id) {
      this.router.navigate(['/properties', property._id]);
    }
  }

  deleteItem(item: Property) {
    this.confirmationService.confirm({ message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle', accept: () => {
      this.apiClient.delete(`/properties/${item._id}`).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property deleted' }); this.loadItems(); } });
    }});
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
