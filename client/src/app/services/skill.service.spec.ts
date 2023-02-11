import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SkillService } from './skill.service';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(SkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
