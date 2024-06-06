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
import { Router } from '@angular/router';
import { Session } from '../../interfaces/session.interface';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let windowHistoryMock: jest.SpyInstance;
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
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    sessionApiService = TestBed.inject(SessionApiService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    windowHistoryMock = jest.spyOn(window.history, 'back');
  });

  afterEach(() => {
    windowHistoryMock.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on click on arrow', async () => {
    const componentBackSpy = jest.spyOn(component, 'back');
    component.back();

    expect(componentBackSpy).toHaveBeenCalled();
  });

  it('should fetch correct session', () => {
    //Given
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'detail')
      .mockReturnValue(of(mockSession));
    component['sessionId'] = '2';

    //When
    component.ngOnInit();

    //Then
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('2');
  });
});
