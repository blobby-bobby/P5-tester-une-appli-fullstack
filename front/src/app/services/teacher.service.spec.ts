import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'Coach',
    lastName: 'Super',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should get teacher detail by id', () => {
    service.detail(mockTeacher.id.toString()).subscribe((teacher: Teacher) => {
      expect(teacher).toEqual(mockTeacher);
    });
  });
});
