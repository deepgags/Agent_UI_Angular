import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroContactFormComponent } from './hero-contact-form.component';

describe('HeroContactFormComponent', () => {
  let component: HeroContactFormComponent;
  let fixture: ComponentFixture<HeroContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroContactFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
