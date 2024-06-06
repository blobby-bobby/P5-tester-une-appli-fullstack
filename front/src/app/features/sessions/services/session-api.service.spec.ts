import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;

  const mockSession: Session = {
    id: 1,
    name: 'Gym',
    description: 'Gym session',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(SessionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all sessions', () => {
    service.all().subscribe((sessions: Session[]) => {
      expect(sessions).toEqual([mockSession]);
    });
  });

  it('should get session by id', () => {
    if (mockSession.id) {
      service
        .detail(mockSession.id.toString())
        .subscribe((session: Session) => {
          expect(session).toEqual(mockSession);
        });
    }
  });

  it('should delete session by id', () => {
    if (mockSession.id) {
      service.delete(mockSession.id.toString()).subscribe((response) => {
        expect(response).toBeNull();
      });
    }
  });

  it('should create session', () => {
    if (mockSession.id) {
      service.create(mockSession).subscribe((session: Session) => {
        expect(session).toEqual(mockSession);
      });
    }
  });

  it('should update session', () => {
    if (mockSession.id) {
      service
        .update(mockSession.id.toString(), mockSession)
        .subscribe((session: Session) => {
          expect(session).toEqual(mockSession);
        });
    }
  });

  it('should add user to session', () => {
    if (mockSession.id) {
      service
        .participate(mockSession.id.toString(), '1')
        .subscribe((session) => {
          expect(session).toEqual(mockSession);
        });
    }
  });

  it('should remove user from session', () => {
    if (mockSession.id) {
      service
        .unParticipate(mockSession.id.toString(), '1')
        .subscribe((session) => {
          expect(session).toEqual(mockSession);
        });
    }
  });
});
