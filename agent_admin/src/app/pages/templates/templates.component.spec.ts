import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplatesComponent } from './templates.component';
import { ApiClientService } from '../../core/services/api-client.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Template } from '../../core/models/api.model';

describe('TemplatesComponent', () => {
  let component: TemplatesComponent;
  let fixture: ComponentFixture<TemplatesComponent>;
  let apiClientSpy: any;

  beforeEach(async () => {
    apiClientSpy = {
      getPaginated: vi.fn(),
      postFormData: vi.fn(),
      patchFormData: vi.fn(),
      delete: vi.fn(),
      deleteImage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TemplatesComponent, ReactiveFormsModule],
      providers: [
        { provide: ApiClientService, useValue: apiClientSpy },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: ConfirmationService, useValue: { confirm: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      templateKey: '',
      name: '',
      description: '',
      enable: true,
      primaryColor: '',
      secondaryColor: '',
    });
  });

  it('should validate image files correctly - valid files', () => {
    const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB

    const { valid, errors } = component.validateImageFiles([validFile]);

    expect(valid.length).toBe(1);
    expect(errors.length).toBe(0);
  });

  it('should validate image files correctly - invalid type', () => {
    const invalidFile = new File([''], 'test.pdf', { type: 'application/pdf' });

    const { valid, errors } = component.validateImageFiles([invalidFile]);

    expect(valid.length).toBe(0);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('Invalid file type');
  });

  it('should validate image files correctly - file too large', () => {
    const largeFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB

    const { valid, errors } = component.validateImageFiles([largeFile]);

    expect(valid.length).toBe(0);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('File too large');
  });

  it('should enforce image count limit - getTotalImageCount', () => {
    component.newImages = [new File([''], '1.jpg', { type: 'image/jpeg' }), new File([''], '2.jpg', { type: 'image/jpeg' })];
    component.selectedItem = { images: [{ _id: '1', url: 'test' }] } as Template;

    expect(component.getTotalImageCount()).toBe(3);
  });

  it('should open dialog with reset form for create', () => {
    component.openDialog();

    expect(component.isEdit).toBe(false);
    expect(component.selectedItem).toBeNull();
    expect(component.newImages.length).toBe(0);
    expect(component.dialogVisible).toBe(true);
  });

  it('should open dialog with populated form for edit', () => {
    const template: Template = {
      templateKey: 't1',
      name: 'Test Template',
      description: 'Test Description',
      enable: false,
      primaryColor: '#22614b',
      secondaryColor: '#c4c4c4',
      images: [{ _id: 'img1', url: 'test.jpg' }],
    };

    component.editItem(template);

    expect(component.isEdit).toBe(true);
    expect(component.selectedItem).toEqual(template);
    expect(component.form.value.templateKey).toBe('t1');
    expect(component.form.value.name).toBe('Test Template');
    expect(component.dialogVisible).toBe(true);
  });

  it('should build FormData correctly for create', () => {
    component.form.patchValue({
      templateKey: 't1',
      name: 'Test',
      description: 'Desc',
      enable: true,
      primaryColor: '#22614b',
      secondaryColor: '#c4c4c4',
    });

    const files = [new File([''], 'test.jpg', { type: 'image/jpeg' })];
    const fd = component.buildFormData(component.form.getRawValue() as Partial<Template>, files);

    expect(fd.has('templateKey')).toBe(true);
    expect(fd.has('name')).toBe(true);
    expect(fd.has('images')).toBe(true);
  });
});
