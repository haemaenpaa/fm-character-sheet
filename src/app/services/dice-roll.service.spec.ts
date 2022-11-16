import { TestBed } from '@angular/core/testing';
import { Roll, RollComponent } from '../model/diceroll';

import { DiceRollService } from './dice-roll.service';

describe('DiceRollService', () => {
  let service: DiceRollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiceRollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send rolls', () => {
    var rolls: Roll[] = [];
    service.rolls().subscribe({
      next: (roll) => {
        rolls.push(roll);
      },
    });
    const roll = new Roll();
    roll.addDie(new RollComponent(20, 2, 'LOWEST', 2));
    roll.addModifier({ name: 'Brawn', value: 2 });
    service.sendRoll(roll);
    expect(rolls).toContain(roll);
  });
});
