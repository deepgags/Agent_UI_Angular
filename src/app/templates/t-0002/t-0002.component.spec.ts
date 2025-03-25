import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T0002Component } from './t-0002.component';

describe('T0002Component', () => {
  let component: T0002Component;
  let fixture: ComponentFixture<T0002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T0002Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T0002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
