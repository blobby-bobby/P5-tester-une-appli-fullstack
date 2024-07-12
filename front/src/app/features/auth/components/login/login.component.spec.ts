import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceMock: Pick<AuthService, 'login'>;
  let sessionServiceMock: Pick<SessionService, 'logIn'>;
  let routerMock: Pick<Router, 'navigate'>;

  let formBuilder: FormBuilder;

  const loginResponse: SessionInformation = {
    token: 'test-token',
    type: 'session',
    id: 1,
    username: 'Coach',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    };

    sessionServiceMock = {
      logIn: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        FormBuilder,
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
    jest.spyOn(authServiceMock, 'login').mockReturnValue(of(loginResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.form.get('email')?.value).toEqual('');
    expect(component.form.get('password')?.value).toEqual('');
  });

  it('should submit form and login', () => {
    // GIVEN
    component.form.setValue({ email: 'test-email', password: 'test-password' });

    // WHEN
    component.submit();
    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test-email',
      password: 'test-password',
    });

    // THEN
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(loginResponse);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toEqual(false);
  });
});
