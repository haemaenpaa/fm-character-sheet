import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AoSelectionService } from './ao-selection.service';

describe('AoSelectionService', () => {
  let service: AoSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(AoSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
