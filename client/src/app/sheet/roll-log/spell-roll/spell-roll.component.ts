import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import {
  ABILITY_TO_NAME,
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

  constructor(private clipboard: Clipboard) {
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
    var macro = `&{template:default}{{name=${this.spellName}}}`;
    if (this.soulCheck) {
      const soulDice = this.soulCheck.dice[0];
      const soulMod = this.soulCheck.modifiers
        .map((mod) => toModifier(mod.value))
        .join('');
      macro += `{{Soul check = [[{${toCheckArithmetic(soulDice)}${soulMod}}>${
        this.soulCheck!.target
      }]] success}}`;
    }
    const hasAttack = !!this.spellAttack;
    if (this.spellAttack) {
      const attackDice = this.spellAttack.dice[0];
      const mods = this.spellAttack.modifiers
        .map((m) => `${toModifier(m.value)}`)
        .join('');
      macro += `{{ To hit = [[${toCheckArithmetic(attackDice)}${mods}]] }}`;
    }
    if (this.spellSave) {
      macro += this.spellSave.modifiers
        .map((mod) => {
          const saveNames = this.saveAbilities(mod.name)
            .map((n) => ABILITY_TO_NAME[n])
            .join('/');
          return `{{ ${saveNames} DV = ${mod.value} }}`;
        })
        .join('');
    }
    if (this.spellDamage) {
      macro += this.spellDamage.dice
        .map((damageDice) => {
          const critDamage = hasAttack
            ? `on crit: ${damageDice.dice * damageDice.sides}`
            : '';
          return `{{${damageDice.name} = [[${damageDice.dice}d${damageDice.sides}]] ${critDamage}}}`;
        })
        .join('');
    }

    this.clipboard.copy(macro);
  }
}
