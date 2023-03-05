import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { SimpleRoll } from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';

@Component({
  selector: 'hit-die-row',
  templateUrl: './hit-die-row.component.html',
  styleUrls: ['./hit-die-row.component.css', '../log-row-shared.css'],
})
export class HitDieRowComponent extends Hoverable {
  @Input() roll!: SimpleRoll;
  constructor(private clipboard: Clipboard) {
    super();
  }
  copyMacro() {
    const dieCount = this.roll.dice.reduce((count, d) => count + d.dice, 0);
    const rolls = this.roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
    const mods = this.roll.modifiers
      .map((m) => `${toModifier(m.value)}`)
      .join('');
    this.clipboard.copy(`/me rolls ${dieCount} hit dice: [[${rolls}${mods}]]`);
  }
}
