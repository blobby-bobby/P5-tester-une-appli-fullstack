import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import { expect } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  let userServiceMock: Pick<UserService, 'getById'>;
  let sessionServiceMock: Pick<SessionService, 'sessionInformation'>;

  const mockUser: User = {
    id: 1,
    email: 'John@doe.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'motdepasse',
    createdAt: new Date(),
  };

  beforeEach(() => {
    userServiceMock = {
      getById: jest.fn(),
    };

    sessionServiceMock = {
      sessionInformation: {
        id: 1,
        username: 'John',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
        token: '123',
        type: 'session',
      },
    };
    TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    jest.spyOn(userServiceMock, 'getById').mockReturnValue(of(mockUser));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user on init', () => {
    component.ngOnInit();

    expect(userServiceMock.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should navigate back on click on arrow', () => {
    const spy = jest.spyOn(component, 'back');
    const button = fixture.debugElement.query(
      By.css('button[mat-icon-button]')
    );
    button.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
});
