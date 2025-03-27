import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T1HeaderComponent } from './t1-header.component';

describe('T1HeaderComponent', () => {
  let component: T1HeaderComponent;
  let fixture: ComponentFixture<T1HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T1HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T1HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
