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
import { TagModule } from 'primeng/tag';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface SiteUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  roleId?: string;
  siteId?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, ToolbarModule, SelectModule, TagModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<SiteUser[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: SiteUser | null = null;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;

  roles = [{ label: 'Admin', value: 'admin' }, { label: 'Editor', value: 'editor' }, { label: 'Viewer', value: 'viewer' }];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    role: [''],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    this.apiClient.getPaginated<SiteUser>('/users', { page: this.currentPage, pageSize: this.pageSize, search: this.searchQuery }).subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch() { this.currentPage = 1; this.loadItems(); }
  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: SiteUser) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ name: item.name, email: item.email, phone: item.phone, role: item.role }); this.dialogVisible = true; }

  resetPassword(item: SiteUser) {
    this.confirmationService.confirm({
      message: 'Reset password for this user?', header: 'Confirm Reset', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const newPassword = prompt('Enter new password (min 8 characters):');
        if (!newPassword || newPassword.length < 8) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Password must be at least 8 characters' });
          return;
        }
        this.apiClient.post(`/users/${item._id}/reset-password`, { newPassword }).subscribe({
          next: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset' }),
        });
      },
    });
  }

  deleteItem(item: SiteUser) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiClient.delete(`/users/${item._id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted' }); this.loadItems(); },
        });
      },
    });
  }

  onSave() {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`/users/${this.selectedItem._id}`, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated' }); this.dialogVisible = false; this.loadItems(); },
      });
    }
  }

  getStatusSeverity(isVerified: boolean, isActive: boolean) {
    if (!isActive) return 'danger';
    return isVerified ? 'success' : 'warn';
  }
}