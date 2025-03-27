import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T2SearchComponent } from './t2-search.component';

describe('T2SearchComponent', () => {
  let component: T2SearchComponent;
  let fixture: ComponentFixture<T2SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T2SearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T2SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
