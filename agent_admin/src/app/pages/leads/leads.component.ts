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
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  leadType: string;
  siteId?: string;
  mlsId?: string;
  message?: string;
  notes?: string;
  createdAt: string;
}

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, ToolbarModule, TagModule, SelectModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  customerId = input<string>();
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<Lead[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: Lead | null = null;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;

  private getQueryParams() {
    const params: any = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchQuery,
    };
    if (this.customerId()) {
      params.siteId = this.customerId();
    }
    return params;
  }

  statuses = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    status: ['new', Validators.required],
    notes: [''],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const params = this.getQueryParams();
    this.apiClient.getPaginated<Lead>('/leads', params).subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch() { this.currentPage = 1; this.loadItems(); }
  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset({ status: 'new' }); this.dialogVisible = true; }
  editItem(item: Lead) { this.isEdit = true; this.selectedItem = item; this.form.patchValue(item); this.dialogVisible = true; }

  deleteItem(item: Lead) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiClient.delete(`/leads/${item._id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Lead deleted' }); this.loadItems(); },
        });
      },
    });
  }

  onSave() {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`/leads/${this.selectedItem._id}`, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Lead updated' }); this.dialogVisible = false; this.loadItems(); },
      });
    }
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'new': return 'info';
      case 'contacted': return 'warn';
      case 'qualified': return 'success';
      case 'converted': return 'success';
      case 'lost': return 'danger';
      default: return 'info';
    }
  }
}