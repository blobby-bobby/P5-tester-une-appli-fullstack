import { TestBed } from '@angular/core/testing';
import { SessionService } from '../services/session.service';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        AuthGuard,
        { provide: SessionService, useValue: {} },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should return false and navigate to login if user is not logged in', () => {
    const sessionService = TestBed.inject(SessionService);
    const router = TestBed.inject(Router);
    sessionService.isLogged = false;
    jest.spyOn(router, 'navigate');

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should return true if user is logged in', () => {
    const sessionService = TestBed.inject(SessionService);
    sessionService.isLogged = true;

    const result = guard.canActivate();

    expect(result).toBe(true);
  });
});
