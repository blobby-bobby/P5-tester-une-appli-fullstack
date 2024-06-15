import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { SessionService } from './services/session.service';
import { Observable, of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let sessionService: SessionService;
  let router: Router;

  const mockSessionService = {
    $isLogged(): Observable<boolean> {
      return of(true);
    },
    logOut(): void {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should check login state', () => {
    let isLogged = false;
    // WHEN
    component.$isLogged().subscribe((log) => (isLogged = log));

    // THEN
    expect(isLogged).toBe(true);
  });

  it('should navigate to root when logOut', () => {
    //Given
    let navigateSpy = jest.spyOn(router, 'navigate');

    //When
    component.logout();

    //Then
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
