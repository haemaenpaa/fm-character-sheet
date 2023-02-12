import { Component, Input } from '@angular/core';
import {
  SOUL_CHECK_ROLL_TITLE,
  SPELL_ATTACK_ROLL_TITLE,
  SPELL_DAMAGE_ROLL_TITLE,
  SPELL_SAVE_ROLL_TITLE,
} from 'src/app/model/constants';
import { MultiRoll, SimpleRoll } from 'src/app/model/diceroll';

@Component({
  selector: 'spell-roll',
  templateUrl: './spell-roll.component.html',
  styleUrls: ['./spell-roll.component.css', '../log-row-shared.css'],
})
export class SpellRollComponent {
  characterName?: string;
  spellName?: string;
  soulCheck?: SimpleRoll;
  spellAttack?: SimpleRoll;
  spellDamage?: SimpleRoll;
  spellSave?: SimpleRoll;

  @Input() set roll(r: MultiRoll) {
    this.characterName = r.rolls
      .filter((r) => r.character)
      .map((r) => r.character!)
      .find((n) => !!n);
    this.spellName = r.rolls
      .filter((r) => r.name)
      .map((r) => r.name!)
      .find((n) => !!n);
    this.soulCheck = r.rolls.find((r) => r.title === SOUL_CHECK_ROLL_TITLE);
    this.spellAttack = r.rolls.find((r) => r.title === SPELL_ATTACK_ROLL_TITLE);
    this.spellDamage = r.rolls.find((r) => r.title === SPELL_DAMAGE_ROLL_TITLE);
    this.spellSave = r.rolls.find((r) => r.title === SPELL_SAVE_ROLL_TITLE);
  }

  saveAbilities(saveVal: string): string[] {
    return saveVal.split('/');
  }
}
