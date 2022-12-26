import { TestBed } from '@angular/core/testing';

import { RollLogService } from './roll-log-service.service';

describe('RollLogServiceService', () => {
  let service: RollLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RollLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
