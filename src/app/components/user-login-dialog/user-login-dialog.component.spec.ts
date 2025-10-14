import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginDialogComponent } from './user-login-dialog.component';

describe('UserLoginDialogComponent', () => {
  let component: UserLoginDialogComponent;
  let fixture: ComponentFixture<UserLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLoginDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
