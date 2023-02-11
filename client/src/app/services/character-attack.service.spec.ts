import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CharacterAttackService } from './character-attack.service';

describe('CharacterAttackService', () => {
  let service: CharacterAttackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(CharacterAttackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
