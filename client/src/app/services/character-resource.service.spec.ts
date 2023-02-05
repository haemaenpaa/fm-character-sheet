import { TestBed } from '@angular/core/testing';

import { CharacterResourceService } from './character-resource.service';

describe('CharacterResourceService', () => {
  let service: CharacterResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
