import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T1HomeComponent } from './t1-home.component';

describe('T1HomeComponent', () => {
  let component: T1HomeComponent;
  let fixture: ComponentFixture<T1HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T1HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T1HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
