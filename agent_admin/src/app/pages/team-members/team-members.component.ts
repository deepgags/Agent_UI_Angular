import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApiClientService, ListQuery } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';

interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  designation: string;
  emailAddress: string;
  phoneNumber: string;
  profileImage?: string;
  createdAt: string;
}

interface TeamMemberForm {
  firstName: string;
  lastName: string;
  designation: string;
  emailAddress: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.scss',
})
export class TeamMembersComponent implements OnInit {
  customerId = input<string>();
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<TeamMember[]>([]);
  loading = signal(false);
  dialogVisible = false;
  isEdit = false;
  selectedItem: TeamMember | null = null;
  searchQuery = '';
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);

  private getEndpoint(): string {
    return this.customerId() ? `/customers/${this.customerId()}/team-members` : '/team-members';
  }

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    designation: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    const endpoint = this.getEndpoint();
    const page = Math.floor(this.first() / this.rows()) + 1;
    this.apiClient.getPaginated<TeamMember>(endpoint, { page, pageSize: this.rows(), search: this.searchQuery }).subscribe({
      next: (res) => { this.items.set(res.data); this.totalRecords.set(res.meta?.total ?? res.data.length); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadItems();
  }

  onSearch() { this.first.set(0); this.loadItems(); }
  openDialog() { this.isEdit = false; this.selectedItem = null; this.form.reset(); this.dialogVisible = true; }
  editItem(item: TeamMember) { this.isEdit = true; this.selectedItem = item; this.form.patchValue({ firstName: item.firstName, lastName: item.lastName, designation: item.designation, emailAddress: item.emailAddress, phoneNumber: item.phoneNumber }); this.dialogVisible = true; }

  deleteItem(item: TeamMember) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const endpoint = this.getEndpoint();
        this.apiClient.delete(`${endpoint}/${item._id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team member deleted' }); this.loadItems(); },
        });
      },
    });
  }

  onSave() {
    if (this.form.invalid) return;
    const data = this.form.value;
    const endpoint = this.getEndpoint();
    if (this.isEdit && this.selectedItem) {
      this.apiClient.patch(`${endpoint}/${this.selectedItem._id}`, data).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team member updated' }); this.dialogVisible = false; this.loadItems(); },
      });
    } else {
      this.apiClient.postFormData(endpoint, this.buildFormData(data)).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team member created' }); this.dialogVisible = false; this.loadItems(); },
      });
    }
  }

  private buildFormData(data: any): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value as string);
      }
    });
    return formData;
  }
}