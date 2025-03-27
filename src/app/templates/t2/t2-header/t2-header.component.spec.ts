import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T2HeaderComponent } from './t2-header.component';

describe('T2HeaderComponent', () => {
  let component: T2HeaderComponent;
  let fixture: ComponentFixture<T2HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T2HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T2HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
