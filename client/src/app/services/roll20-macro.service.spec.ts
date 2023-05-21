import { TestBed } from '@angular/core/testing';

import { Roll20MacroService } from './roll20-macro.service';
import { RollComponent, SimpleRoll } from '../model/diceroll';

describe('Roll20MacroService', () => {
  let service: Roll20MacroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Roll20MacroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate ability roll', () => {
    const roll: SimpleRoll = new SimpleRoll();
    roll.title = 'br';
    roll.addDie(new RollComponent(20, 2, 'HIGHEST', 1));

    const result = service.getDiceAlgebra(roll);

    expect(result).toMatch(/Brawn/);
    expect(result).toMatch(/2d20kh1/);
  });

  it('should generate saving throw roll', () => {
    const roll: SimpleRoll = new SimpleRoll();
    roll.title = 'int/cun_save';
    roll.addDie(new RollComponent(20, 2, 'HIGHEST', 1));

    const result = service.getDiceAlgebra(roll);

    expect(result).toMatch(/Intelligence/);
    expect(result).toMatch(/Cunning/);
    expect(result).toMatch(/2d20kh1/);
  });

  it('should generate initiative roll', () => {
    const roll: SimpleRoll = new SimpleRoll();
    roll.title = 'initiative';
    roll.addDie(new RollComponent(20, 2, 'HIGHEST', 1));

    const result = service.getDiceAlgebra(roll);

    expect(result).toMatch(/Initiative/);
    expect(result).toMatch(/\&\{tracker:\+\}/);
    expect(result).toMatch(/2d20kh1/);
  });
});
