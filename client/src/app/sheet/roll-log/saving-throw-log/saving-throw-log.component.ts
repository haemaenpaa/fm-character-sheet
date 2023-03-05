import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import {
  ABILITY_ABBREVIATIONS,
  ABILITY_TO_NAME,
} from 'src/app/model/constants';
import { Roll, SimpleRoll } from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';

@Component({
  selector: 'saving-throw-log',
  templateUrl: './saving-throw-log.component.html',
  styleUrls: ['./saving-throw-log.component.css', '../log-row-shared.css'],
})
export class SavingThrowLogComponent extends Hoverable {
  @Input('roll') roll!: SimpleRoll;

  constructor(private clipboard: Clipboard) {
    super();
  }

  get abilities(): string[] {
    if (!this.roll.title) {
      return [];
    }
    return this.roll.title.split('_')[0].split('/');
  }

  copyMacro() {
    const abilityName = this.abilities
      .map((ab) => ABILITY_TO_NAME[ab])
      .join('/');
    const rolls = this.roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
    const mods = this.roll.modifiers
      .map((m) => `${toModifier(m.value)}`)
      .join('');
    this.clipboard.copy(
      `/me makes a ${abilityName} save : [[${rolls}${mods}]]`
    );
  }
}
