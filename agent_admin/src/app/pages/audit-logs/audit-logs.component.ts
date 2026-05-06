import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
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
  currentPage = 1;
  pageSize = 10;

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const query: ListQuery = { page: this.currentPage, pageSize: this.pageSize, search: this.searchQuery };
    this.apiClient.getPaginated<AuditLog>('/audit-logs', query).subscribe({ next: (res) => { this.items.set(res.data); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  onSearch() { this.currentPage = 1; this.loadItems(); }
}