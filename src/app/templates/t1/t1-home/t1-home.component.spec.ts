import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/templates/t1/t1-home/t1-home.component.spec.ts
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
========
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
>>>>>>>> origin/multi-pages:src/app/templates/shared/about/about.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
