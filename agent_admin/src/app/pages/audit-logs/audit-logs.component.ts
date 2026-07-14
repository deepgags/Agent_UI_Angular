import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  user: string;
  timestamp: string;
  details: string;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, ToolbarModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss',
})
export class AuditLogsComponent implements OnInit {
  private apiClient = inject(ApiClientService);

  items = signal<AuditLog[]>([]);
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
    this.apiClient.getPaginated<AuditLog>('/audit-logs', query).subscribe({ next: (res) => { this.items.set(res.data); this.totalRecords.set(res.meta?.total ?? res.data.length); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadItems();
  }

  onSearch() { this.first.set(0); this.loadItems(); }
}