import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { LoginButtonComponent } from './login-button.component';

describe('LoginButtonComponent', () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginButtonComponent],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
