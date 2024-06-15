import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockUser: User = {
    id: 1,
    email: 'john@doe.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
    password: 'motdepasse',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should retrieve user by id', () => {
    // WHEN
    service.getById(mockUser.id.toString()).subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    // THEN
    const req = httpMock.expectOne(`api/user/${mockUser.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete user by id', () => {
    // WHEN
    service.delete(mockUser.id.toString()).subscribe((response) => {
      expect(response).toBeNull();
    });

    // THEN
    const req = httpMock.expectOne(`api/user/${mockUser.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
