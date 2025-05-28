import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSelectionDialogComponent } from './template-selection-dialog.component';

describe('TemplateSelectionDialogComponent', () => {
  let component: TemplateSelectionDialogComponent;
  let fixture: ComponentFixture<TemplateSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateSelectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
