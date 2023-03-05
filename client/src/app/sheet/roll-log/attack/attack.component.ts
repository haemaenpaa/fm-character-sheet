import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import {
  MultiRoll,
  SimpleRoll,
  toCheckArithmetic,
} from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';
import { Clipboard } from '@angular/cdk/clipboard';
import { ABILITY_TO_NAME } from 'src/app/model/constants';

@Component({
  selector: 'attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.css', '../log-row-shared.css'],
})
export class AttackComponent extends Hoverable {
  private _roll!: MultiRoll;
  toHit?: SimpleRoll;
  damage?: SimpleRoll;
  effects: SimpleRoll[] = [];

  constructor(private clipboard: Clipboard) {
    super();
  }

  @Input() set roll(r: MultiRoll) {
    this._roll = r;
    this.toHit = r.rolls.find((sr) => sr.title === 'attack');
    this.damage = r.rolls.find((sr) => sr.title === 'attackdmg');
    this.effects = r.rolls.filter((sr) => sr.title === 'attackeffect');
  }
  get character(): string {
    return (
      this._roll.rolls.map((r) => r.character).find((name) => !!name) || ''
    );
  }

  saveAbilities(saveVal: string): string[] {
    return saveVal.split('/');
  }

  copyMacro() {
    var roll20Macro = '&{template:default}';
    if (this.toHit) {
      roll20Macro += `{{name=${this.toHit.name}}}`;

      const dice = this.toHit.dice[0];
      var roll = toCheckArithmetic(dice);
      roll += toModifier(dice.bonus);

      const mods = this.toHit.modifiers
        .map((mod) => toModifier(mod.value))
        .join('');

      roll20Macro += `{{To Hit=[[${roll}${mods}]]}}`;
    }
    if (this.damage) {
      roll20Macro += this.damage.dice
        .map((r) => {
          return `{{${r.name} = [[${r.dice}d${r.sides}]]${toModifier(
            r.bonus
          )}, crit damage ${r.dice * r.sides}}}`;
        })
        .join('');
    }
    roll20Macro += this.effects
      .map((effect) => {
        var dv = '';
        if (effect.modifiers.length > 0) {
          dv =
            effect.modifiers
              .map((mod) => {
                const saveAbilities = this.saveAbilities(mod.name)
                  .map((n) => ABILITY_TO_NAME[n])
                  .join('/');
                return `DV ${mod.value} ${saveAbilities}`;
              })
              .join() + ' or ';
        }
        return `{{Effect = ${dv}${effect.description}}}`;
      })
      .join('');
    this.clipboard.copy(roll20Macro);
  }
}
