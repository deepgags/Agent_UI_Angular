import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T2HomeComponent } from './t2-home.component';

describe('T2HomeComponent', () => {
  let component: T2HomeComponent;
  let fixture: ComponentFixture<T2HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T2HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T2HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
