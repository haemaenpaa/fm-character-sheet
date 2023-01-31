import { TestBed } from '@angular/core/testing';

import { BiographyService } from './biography.service';

describe('BiographyService', () => {
  let service: BiographyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiographyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
