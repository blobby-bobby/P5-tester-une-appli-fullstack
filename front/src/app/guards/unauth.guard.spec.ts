import { TestBed } from '@angular/core/testing';
import { SessionService } from '../services/session.service';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { UnauthGuard } from './unauth.guard';

describe('AuthGuard', () => {
  let guard: UnauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionService, useValue: {} },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    });
    guard = TestBed.inject(UnauthGuard);
  });

  it('should navigate to sessions if user is logged in', () => {
    const sessionService = TestBed.inject(SessionService);
    const router = TestBed.inject(Router);
    sessionService.isLogged = true;
    jest.spyOn(router, 'navigate');

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['rentals']);
  });

  it('should return true if user is not logged in', () => {
    const sessionService = TestBed.inject(SessionService);
    sessionService.isLogged = false;

    const result = guard.canActivate();

    expect(result).toBe(true);
  });
});
