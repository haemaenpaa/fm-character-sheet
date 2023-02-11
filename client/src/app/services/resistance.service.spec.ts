import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ResistanceService } from './resistance.service';

describe('ResistanceService', () => {
  let service: ResistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(ResistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
