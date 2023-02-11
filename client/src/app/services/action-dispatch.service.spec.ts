import { TestBed } from '@angular/core/testing';
import { Roll, RollComponent } from '../model/diceroll';

import { ActionDispatchService } from './action-dispatch.service';
import { CharacterService } from './character.service';

describe('ActionDispatchService', () => {
  let service: ActionDispatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CharacterService, useValue: {} }],
    });
    service = TestBed.inject(ActionDispatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
