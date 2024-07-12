import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { Router } from '@angular/router';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let router: Router;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSession: Session = {
    name: 'Gym Session',
    description: 'Gym Description',
    date: new Date(),
    teacher_id: 1,
    users: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService,
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    sessionApiService = TestBed.inject(SessionApiService);
  });

  it('should initialize component', () => {
    expect(component).not.toBeNull();
  });

  it("should redirect user to '/sessions' if user is not admin", () => {
    // GIVEN
    let navigateSpy = jest.spyOn(router, 'navigate');
    mockSessionService.sessionInformation.admin = false;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it("should not redirect user if user's role is admin", () => {
    // GIVEN
    let navigateSpy = jest.spyOn(router, 'navigate');
    mockSessionService.sessionInformation.admin = true;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(navigateSpy).not.toHaveBeenCalledWith(['/sessions']);
  });

  it('should submit create form successfully', () => {
    //GIVEN
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'create')
      .mockReturnValue(of(mockSession));

    //WHEN
    component.submit();

    //THEN
    expect(sessionApiServiceSpy).toHaveBeenCalled();
  });

  it('should submit update form successfully', () => {
    //GIVEN
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'update')
      .mockReturnValue(of(mockSession));
    component.onUpdate = true;

    //WHEN
    component.submit();

    //THEN
    expect(sessionApiServiceSpy).toHaveBeenCalled();
  });

  it('should navigate back on click on arrow', () => {
    // GIVEN
    const navigateSpy = jest.spyOn(router, 'navigate');

    // WHEN
    component['exitPage']('redirect to sessions');

    // THEN
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});
