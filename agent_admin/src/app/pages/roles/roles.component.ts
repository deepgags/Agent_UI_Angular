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

interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<Role[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: Role | null = null;
  currentPage = 1;
  pageSize = 10;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    this.apiClient.getPaginated<Role>('/roles', { page: this.currentPage, pageSize: this.pageSize }).subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: Role) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ name: item.name, description: item.description }); this.dialogVisible = true; }

  deleteItem(item: Role) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiClient.delete(`/roles/${item._id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role deleted' }); this.loadItems(); },
        });
      },
    });
  }

  onSave() {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`/roles/${this.selectedItem._id}`, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role updated' }); this.dialogVisible = false; this.loadItems(); },
      });
    } else {
      this.apiClient.post('/roles', data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role created' }); this.dialogVisible = false; this.loadItems(); },
      });
    }
  }
}