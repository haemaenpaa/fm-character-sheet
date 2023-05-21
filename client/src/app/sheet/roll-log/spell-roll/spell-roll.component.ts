import { Clipboard } from '@angular/cdk/clipboard';
import { devOnlyGuardedExpression } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import {
  SOUL_CHECK_ROLL_TITLE,
  SPELL_ATTACK_ROLL_TITLE,
  SPELL_DAMAGE_ROLL_TITLE,
  SPELL_SAVE_ROLL_TITLE,
} from 'src/app/model/constants';
import {
  MultiRoll,
  SimpleRoll,
  toCheckArithmetic,
} from 'src/app/model/diceroll';
import { Roll20MacroService } from 'src/app/services/roll20-macro.service';
import { toModifier } from 'src/app/utils/modifier-utils';

@Component({
  selector: 'spell-roll',
  templateUrl: './spell-roll.component.html',
  styleUrls: ['./spell-roll.component.css', '../log-row-shared.css'],
})
export class SpellRollComponent extends Hoverable {
  characterName?: string;
  spellName?: string;
  soulCheck?: SimpleRoll;
  spellAttack?: SimpleRoll;
  spellDamage?: SimpleRoll;
  spellSave?: SimpleRoll;

  constructor(
    private clipboard: Clipboard,
    private macroService: Roll20MacroService
  ) {
    super();
  }

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

  copyMacro() {
    this.clipboard.copy(this.macroService.getDiceAlgebra(this.roll));
  }
}
