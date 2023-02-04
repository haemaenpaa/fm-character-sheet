import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SpellService } from './spell.service';

describe('SpellService', () => {
  let service: SpellService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(SpellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
