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
import { ApiClientService } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface City { _id: string; city: string; province_id: string; province_name: string; }

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ConfirmDialogModule, ToastModule, ToolbarModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss',
})
export class CitiesComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<City[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: City | null = null;

  form = this.fb.group({ name: ['', Validators.required], province: ['', Validators.required] });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    this.apiClient.getPaginated<City>('/cities', { page: 1, pageSize: 10 }).subscribe({ next: (res) => { this.items.set(res.data); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: City) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ name: item.city, province: item.province_id }); this.dialogVisible = true; }

  deleteItem(item: City) {
    this.confirmationService.confirm({ message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle', accept: () => {
      this.apiClient.delete(`/cities/${item._id}`).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City deleted' }); this.loadItems(); } });
    }});
  }

  onSave() {
    if (this.form.invalid) return;
    const data = { city: this.form.value.name, province_id: this.form.value.province, province_name: this.form.value.name };
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`/cities/${this.selectedItem._id}`, data).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City updated' }); this.dialogVisible = false; this.loadItems(); } });
    } else {
      this.apiClient.post('/cities', data).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'City created' }); this.dialogVisible = false; this.loadItems(); } });
    }
  }
}