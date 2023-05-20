import { TestBed } from '@angular/core/testing';

import { AdvantageResolverService } from './advantage-resolver.service';

describe('AdvantageResolverService', () => {
  let service: AdvantageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvantageResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should give advantage on shift key', () => {
    expect(
      service.resolveForEvent({ shiftKey: true } as unknown as Event)
    ).toBe('advantage');
  });
  it('should give disadvantage on ctrl key', () => {
    expect(service.resolveForEvent({ ctrlKey: true } as unknown as Event)).toBe(
      'disadvantage'
    );
  });
  it('should give none by default', () => {
    expect(service.resolveForEvent({} as unknown as Event)).toBe('none');
  });
});
