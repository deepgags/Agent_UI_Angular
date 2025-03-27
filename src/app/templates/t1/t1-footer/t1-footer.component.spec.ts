import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T1FooterComponent } from './t1-footer.component';

describe('T1FooterComponent', () => {
  let component: T1FooterComponent;
  let fixture: ComponentFixture<T1FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [T1FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(T1FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
