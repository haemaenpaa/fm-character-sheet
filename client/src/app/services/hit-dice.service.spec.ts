import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { HitDiceService } from './hit-dice.service';

describe('HitDiceService', () => {
  let service: HitDiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(HitDiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
