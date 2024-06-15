import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { BehaviorSubject } from 'rxjs';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;
  let isLoggedSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
    isLoggedSubject = service['isLoggedSubject'] as BehaviorSubject<boolean>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value of false', () => {
    const result = service.$isLogged();
    result.subscribe((value) => {
      expect(value).toBe(false);
    });
  });

  it('should log in and set isLogged to true', () => {
    // GIVEN
    const user: SessionInformation = {
      token: 'test',
      type: 'teacher',
      id: 1,
      username: 'name',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true,
    };

    const spy = jest.spyOn(isLoggedSubject, 'next');

    // WHEN
    service.logIn(user);

    // THEN
    isLoggedSubject.subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      expect(spy).toBeCalledWith(true);
      expect(service.sessionInformation).toEqual(user);
    });
  });

  it('should log out and set isLogged to false', () => {
    // GIVEN
    const spy = jest.spyOn(isLoggedSubject, 'next');

    // WHEN
    service.logOut();

    // THEN
    isLoggedSubject.subscribe((isLogged) => {
      expect(isLogged).toBe(false);
      expect(spy).toBeCalledWith(false);
      expect(service.sessionInformation).toBeUndefined();
    });
  });
});
