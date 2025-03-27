import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T1SearchComponent } from './t1-search.component';

describe('T1SearchComponent', () => {
  let component: T1SearchComponent;
  let fixture: ComponentFixture<T1SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T1SearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T1SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
