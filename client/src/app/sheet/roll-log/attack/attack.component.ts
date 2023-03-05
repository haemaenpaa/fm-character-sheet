import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { MultiRoll, SimpleRoll } from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';
import { Clipboard } from '@angular/cdk/clipboard';

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
      var roll = `${dice.dice}d${dice.sides}`;
      if (dice.keep < dice.dice) {
        roll += `k${dice.keepMode == 'HIGHEST' ? 'h' : 'l'}${dice.keep}`;
      }
      if (dice.bonus) {
        roll += dice.bonus > 0 ? '+' : '';
        roll += dice.bonus;
      }
      roll20Macro += `{{To Hit=[[${roll}]]}}`;
    }
    if (this.damage) {
      roll20Macro += this.damage.dice
        .map((r) => {
          return `{{${r.name} = [[${r.dice}d${r.sides}]]${toModifier(
            r.bonus
          )}, crit damage ${r.dice * r.sides}}}`;
        })
        .join();
    }
    roll20Macro += this.effects
      .map((effect) => {
        var dv = '';
        if (effect.modifiers.length > 0) {
          dv =
            effect.modifiers
              .map((mod) => {
                return `DV ${mod.value} ${this.saveAbilities(mod.name)}`;
              })
              .join() + ' or ';
        }
        return `{{Effect = ${dv}${effect.description}}}`;
      })
      .join();
    this.clipboard.copy(roll20Macro);
  }
}
