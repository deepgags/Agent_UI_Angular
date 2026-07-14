import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Customer {
  _id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  role: 'Agent' | 'Broker';
  isApproved: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    TagModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  customers = signal<Customer[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedCustomer: Customer | null = null;
  searchQuery = '';
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);

  form = this.fb.group({
    businessName: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: [''],
    emailAddress: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['Agent'],
  });

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading.set(true);
    const page = Math.floor(this.first() / this.rows()) + 1;
    const query: ListQuery = { page, pageSize: this.rows(), search: this.searchQuery };
    this.apiClient.getPaginated<Customer>('/customers', query).subscribe({
      next: (res) => {
        this.customers.set(res.data);
        this.totalRecords.set(res.meta?.total ?? res.data.length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadCustomers();
  }

  onSearch() {
    this.first.set(0);
    this.loadCustomers();
  }

  openDialog() {
    this.isEdit = false;
    this.selectedCustomer = null;
    this.form.reset({ role: 'Agent' });
    this.dialogVisible = true;
  }

  editCustomer(customer: Customer) {
    this.isEdit = true;
    this.selectedCustomer = customer;
    this.form.patchValue({
      businessName: customer.businessName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      emailAddress: customer.emailAddress,
      phoneNumber: customer.phoneNumber,
      role: customer.role,
    });
    this.dialogVisible = true;
  }

  viewCustomer(customer: Customer) {
    this.router.navigate(['/customers', customer._id]);
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: `Are you sure you want to deactivate <strong>${customer.businessName}</strong>?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiClient.delete(`/customers/${customer._id}`).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer deactivated' });
            this.loadCustomers();
          },
        });
      },
      reject: () => {},
    });
  }

  hardDeleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: `This will <strong>permanently</strong> delete <strong>${customer.businessName}</strong> and all associated data. This action cannot be undone.`,
      header: 'Permanent Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiClient.delete(`/customers/${customer._id}?hardDelete=true`).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer permanently deleted' });
            this.loadCustomers();
          },
        });
      },
      reject: () => {},
    });
  }

  approveCustomer(customer: Customer) {
    this.apiClient.post(`/customers/${customer._id}/approve`, {}).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer approved' });
        this.loadCustomers();
      },
    });
  }

  resetCustomerPassword(customer: Customer) {
    this.confirmationService.confirm({
      message: 'Reset password for this customer?',
      header: 'Confirm Reset',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const newPassword = prompt('Enter new password (min 8 characters):');
        if (!newPassword || newPassword.length < 8) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Password must be at least 8 characters' });
          return;
        }
        this.apiClient.post(`/customers/${customer._id}/reset-password`, { newPassword }).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfully' });
          },
        });
      },
    });
  }

  onSave() {
    if (this.form.invalid) return;
    const { password, ...formData } = this.form.value;
    const data = this.isEdit ? formData : { ...formData, password };
    if (this.isEdit && this.selectedCustomer) {
      this.apiClient.patch(`/customers/${this.selectedCustomer._id}`, data).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer updated' });
          this.dialogVisible = false;
          this.loadCustomers();
        },
      });
    } else {
      this.apiClient.post('/customers', data).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer created' });
          this.dialogVisible = false;
          this.loadCustomers();
        },
      });
    }
  }

  getStatusSeverity(isApproved: boolean) {
    return isApproved ? 'success' : 'warn';
  }

  getStatusLabel(isApproved: boolean) {
    return isApproved ? 'Active' : 'Pending';
  }
}