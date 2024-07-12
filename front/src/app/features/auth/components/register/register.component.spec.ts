import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { By } from '@angular/platform-browser';
import { fireEvent, screen, waitFor } from '@testing-library/angular';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: {
    register: jest.Mock;
  };
  let routerMock: {
    navigate: jest.Mock;
  };

  const formValue: RegisterRequest = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.com',
    password: 'password',
  };

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register new user and navigate to login', () => {
    // GIVEN
    authServiceMock.register.mockReturnValue(of(undefined));
    component.form.setValue(formValue);
    const registerForm = fixture.debugElement.query(By.css('form'));

    // WHEN
    registerForm.triggerEventHandler('ngSubmit', null);

    // THEN
    expect(authServiceMock.register).toHaveBeenCalledWith(formValue);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toEqual(false);
  });

  it('should disable submit button while form is invalid', async () => {
    // GIVEN
    component.form.setValue({
      firstName: 'Coach',
      lastName: '',
      email: '',
      password: '',
    });

    const submitButton = screen.queryByText('Submit') as HTMLButtonElement;

    // WHEN
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    // THEN
    expect(submitButton.disabled).toEqual(true);
  });
});
