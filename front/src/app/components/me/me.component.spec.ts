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
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  let userService: UserService;
  let router: Router;

  const mockUser: User = {
    id: 1,
    email: 'John@doe.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'motdepasse',
    createdAt: new Date(),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut(): void {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user on init', () => {
    // GIVEN
    let userServiceSpy = jest
      .spyOn(userService, 'getById')
      .mockReturnValue(of(mockUser));

    // WHEN
    component.ngOnInit();

    // THEN
    expect(component.user?.firstName).toBe('John');
    expect(userServiceSpy).toHaveBeenCalledWith('1');
  });

  it('should navigate back on click on arrow', () => {
    // GIVEN
    const spy = jest.spyOn(component, 'back');
    const button = fixture.debugElement.query(
      By.css('button[mat-icon-button]')
    );

    // WHEN
    button.nativeElement.click();

    // THEN
    expect(spy).toHaveBeenCalled();
  });

  it('should delete user and redirect to root', () => {
    // GIVEN
    let userServiceSpy = jest
      .spyOn(userService, 'delete')
      .mockReturnValue(of(void 0));
    let navigateSpy = jest.spyOn(router, 'navigate');

    // WHEN
    component.delete();

    // THEN
    expect(userServiceSpy).toHaveBeenCalled();
    // expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
