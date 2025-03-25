import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T0001Component } from './t-0001.component';

describe('T0001Component', () => {
  let component: T0001Component;
  let fixture: ComponentFixture<T0001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T0001Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T0001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
