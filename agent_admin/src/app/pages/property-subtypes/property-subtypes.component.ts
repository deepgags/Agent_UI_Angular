import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { ApiClientService } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface PropertySubtype { _id: string; LookupValue: string; LookupKey: string; LookupName: string; propertyTypeId?: string; }

@Component({
  selector: 'app-property-subtypes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ConfirmDialogModule, ToastModule, ToolbarModule, SelectModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './property-subtypes.component.html',
  styleUrl: './property-subtypes.component.scss',
})
export class PropertySubtypesComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<PropertySubtype[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: PropertySubtype | null = null;

  propertyTypes = [{ label: 'House', value: 'house' }, { label: 'Apartment', value: 'apartment' }, { label: 'Condo', value: 'condo' }];

  getPropertyTypeName(typeId: string): string {
    return this.propertyTypes.find(t => t.value === typeId)?.label || typeId;
  }

  form = this.fb.group({ name: ['', Validators.required], propertyTypeId: ['', Validators.required] });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    this.apiClient.getPaginated<PropertySubtype>('/property-subtypes', { page: 1, pageSize: 10 }).subscribe({ next: (res) => { this.items.set(res.data); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: PropertySubtype) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ name: item.LookupValue, propertyTypeId: item.propertyTypeId }); this.dialogVisible = true; }

  deleteItem(item: PropertySubtype) {
    this.confirmationService.confirm({ message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle', accept: () => {
      this.apiClient.delete(`/property-subtypes/${item._id}`).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subtype deleted' }); this.loadItems(); } });
    }});
  }

  onSave() {
    if (this.form.invalid) return;
    const data = { LookupValue: this.form.value.name, propertyTypeId: this.form.value.propertyTypeId };
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`/property-subtypes/${this.selectedItem._id}`, data).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subtype updated' }); this.dialogVisible = false; this.loadItems(); } });
    } else {
      this.apiClient.post('/property-subtypes', data).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subtype created' }); this.dialogVisible = false; this.loadItems(); } });
    }
  }
}