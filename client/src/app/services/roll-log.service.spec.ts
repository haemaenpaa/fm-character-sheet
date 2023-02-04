import { TestBed } from '@angular/core/testing';
import { ActionDispatchService } from './action-dispatch.service';

import { RollLogService } from './roll-log-service.service';

const dummyActionDispatchService = {
  rolls: () => ({
    subscribe: () => {},
  }),
};

describe('RollLogServiceService', () => {
  let service: RollLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActionDispatchService,
          useValue: dummyActionDispatchService,
        },
      ],
    });
    service = TestBed.inject(RollLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
