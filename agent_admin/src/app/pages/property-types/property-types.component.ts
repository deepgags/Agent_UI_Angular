import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiClientService } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface PropertyType { _id: string; LookupValue: string; LookupKey: string; LookupName: string; }

@Component({
  selector: 'app-property-types',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ConfirmDialogModule, ToastModule, ToolbarModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './property-types.component.html',
  styleUrl: './property-types.component.scss',
})
export class PropertyTypesComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<PropertyType[]>([]);
  loading = signal(false);
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);
  dialogVisible = false;
  isEdit = false;
  selectedItem: PropertyType | null = null;

  form = this.fb.group({ name: ['', Validators.required] });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const page = Math.floor(this.first() / this.rows()) + 1;
    this.apiClient.getPaginated<PropertyType>('/property-types', { page, pageSize: this.rows() }).subscribe({ next: (res) => { this.items.set(res.data); this.totalRecords.set(res.meta?.total ?? res.data.length); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadItems();
  }

  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: PropertyType) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ name: item.LookupValue }); this.dialogVisible = true; }

  deleteItem(item: PropertyType) {
    this.confirmationService.confirm({ message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle', accept: () => {
      this.apiClient.delete(`/property-types/${item._id}`).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property type deleted' }); this.loadItems(); } });
    }});
  }

  onSave() {
    if (this.form.invalid) return;
    const data = { LookupValue: this.form.value.name };
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`/property-types/${this.selectedItem._id}`, data).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property type updated' }); this.dialogVisible = false; this.loadItems(); } });
    } else {
      this.apiClient.post('/property-types', data).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Property type created' }); this.dialogVisible = false; this.loadItems(); } });
    }
  }
}