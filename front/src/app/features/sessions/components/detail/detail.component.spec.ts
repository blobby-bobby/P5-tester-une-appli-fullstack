import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { DetailComponent } from './detail.component';
import { MatIconModule } from '@angular/material/icon';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { Router } from '@angular/router';
import { routes } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  let sessionApiService: SessionApiService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
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
      declarations: [DetailComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);

    sessionApiService = TestBed.inject(SessionApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on click on arrow', async () => {
    // GIVEN
    const componentBackSpy = jest.spyOn(component, 'back');

    // WHEN
    component.back();

    // THEN
    expect(componentBackSpy).toBeDefined();
    expect(componentBackSpy).toHaveBeenCalled();
  });

  it('should fetch correct session on init', () => {
    //GIVEN
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'detail')
      .mockReturnValue(of(mockSession));
    component.sessionId = '2';

    //WHEN
    component.ngOnInit();

    //THEN
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('2');
  });

  it('should delete session and redirect to sessions page', () => {
    //GIVEN
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'delete')
      .mockReturnValue(of({}));

    component.sessionId = '2';
    let navigateSpy = jest.spyOn(router, 'navigate');

    //WHEN
    component.delete();

    //THEN
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('2');
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate and fetch correct session', () => {
    //GIVEN
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'participate')
      .mockReturnValue(of(void 0));

    component.sessionId = '2';
    component.userId = '3';

    //WHEN
    component.participate();

    //THEN
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('2', '3');
  });

  it('should unparticipate', () => {
    //GIVEN
    component.sessionId = '2';
    component.userId = '3';

    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'unParticipate')
      .mockReturnValue(of(void 0));

    //WHEN
    component.unParticipate();

    //THEN
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('2', '3');
  });

  it('should fetch session', () => {
    //GIVEN
    //WHEN
    //THEN
  });
});
