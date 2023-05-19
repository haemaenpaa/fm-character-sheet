import { TestBed } from '@angular/core/testing';

import { Roll20MacroService } from './roll20-macro.service';

describe('Roll20MacroService', () => {
  let service: Roll20MacroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Roll20MacroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
