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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TagModule } from 'primeng/tag';
import { ApiClientService } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Template, TemplateImage } from '../../core/models/api.model';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DialogModule,
    ConfirmDialogModule, ToastModule, ToolbarModule, ToggleSwitchModule, ColorPickerModule, TagModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  items = signal<Template[]>([]);
  loading = signal(false);
  searchQuery = '';
  dialogVisible = false;
  isEdit = false;
  selectedItem: Template | null = null;
  newImages: File[] = [];
  imagesToDelete: string[] = [];

  form = this.fb.group({
    templateKey: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    enable: [true],
    primaryColor: [''],
    secondaryColor: [''],
  });

  ngOnInit() { this.loadItems(); }

  loadItems() {
    this.loading.set(true);
    this.apiClient.getPaginated<Template>('/templates', { page: 1, pageSize: 10, search: this.searchQuery }).subscribe({
      next: (res) => { this.items.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch() { this.loadItems(); }

  openDialog() {
    this.isEdit = false;
    this.selectedItem = null;
    this.newImages = [];
    this.imagesToDelete = [];
    this.form.reset({ enable: true, primaryColor: '', secondaryColor: '' });
    this.dialogVisible = true;
  }

  editItem(item: Template) {
    this.isEdit = true;
    this.selectedItem = item;
    this.newImages = [];
    this.imagesToDelete = [];
    this.form.patchValue({
      templateKey: item.templateKey,
      name: item.name,
      description: item.description || '',
      enable: item.enable,
      primaryColor: item.primaryColor || '',
      secondaryColor: item.secondaryColor || '',
    });
    this.dialogVisible = true;
  }

  deleteItem(item: Template) {
    this.confirmationService.confirm({
      message: 'Are you sure?', header: 'Confirm Delete', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiClient.delete(`/templates/${item._id}`).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template deleted' }); this.loadItems(); },
        });
      },
    });
  }

  buildFormData(template: Partial<Template>, images?: File[]): FormData {
    const fd = new FormData();
    if (template.templateKey) fd.append('templateKey', template.templateKey);
    if (template.name) fd.append('name', template.name);
    if (template.description) fd.append('description', template.description || '');
    if (template.enable !== undefined) fd.append('enable', String(template.enable));
    if (template.primaryColor) fd.append('primaryColor', template.primaryColor);
    if (template.secondaryColor) fd.append('secondaryColor', template.secondaryColor);
    images?.forEach((file) => fd.append('images', file));
    return fd;
  }

  validateImageFiles(files: File[]): { valid: File[]; errors: string[] } {
    const valid: File[] = [];
    const errors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        errors.push(`${file.name}: Invalid file type. Allowed: JPEG, PNG, GIF, WEBP`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: File too large. Max 5MB`);
        continue;
      }
      valid.push(file);
    }
    return { valid, errors };
  }

  getTotalImageCount(): number {
    const existingCount = this.selectedItem?.images.filter((img) => !this.imagesToDelete.includes(img._id)).length || 0;
    return existingCount + this.newImages.length;
  }

  onSave() {
    if (this.form.invalid) return;
    if (this.getTotalImageCount() < 2) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Minimum 2 images required' });
      return;
    }
    if (this.getTotalImageCount() > 9) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Maximum 5 images allowed' });
      return;
    }

    const formValue = this.form.value;
    const templateData: Partial<Template> = {
      templateKey: formValue.templateKey || undefined,
      name: formValue.name || undefined,
      description: formValue.description || undefined,
      enable: formValue.enable ?? undefined,
      primaryColor: formValue.primaryColor || undefined,
      secondaryColor: formValue.secondaryColor || undefined,
    };

    this.loading.set(true);
    if (this.isEdit && this.selectedItem) {
      const fd = this.buildFormData(templateData, this.newImages);
      this.apiClient.patchFormData(`/templates/${this.selectedItem.templateKey}`, fd).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template updated' });
          this.dialogVisible = false;
          this.loading.set(false);
          this.loadItems();
        },
        error: () => this.loading.set(false),
      });
    } else {
      const fd = this.buildFormData(templateData, this.newImages);
      this.apiClient.postFormData('/templates', fd).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template created' });
          this.dialogVisible = false;
          this.loading.set(false);
          this.loadItems();
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    const { valid, errors } = this.validateImageFiles(files);

    if (errors.length > 0) {
      errors.forEach((err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err }));
    }

    const newTotal = this.getTotalImageCount() + valid.length;
    if (newTotal > 5) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Maximum 5 images allowed' });
      return;
    }

    this.newImages.push(...valid);
    input.value = '';
  }

  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  confirmDeleteImage(image: TemplateImage) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this image?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteImage(image),
    });
  }

  deleteImage(image: TemplateImage) {
    if (this.isEdit && this.selectedItem) {
      this.apiClient.deleteImage(this.selectedItem.templateKey, image._id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Image deleted' });
          if (this.selectedItem) {
            this.selectedItem.images = this.selectedItem.images.filter((img) => img._id !== image._id);
          }
        },
        error: () => {},
      });
    } else {
      this.imagesToDelete.push(image._id);
    }
  }
}