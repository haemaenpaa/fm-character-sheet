import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { Roll, SimpleRoll } from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';

@Component({
  selector: 'health-roll-row',
  templateUrl: './health-roll-row.component.html',
  styleUrls: ['./health-roll-row.component.css', '../log-row-shared.css'],
})
export class HealthRollRowComponent extends Hoverable {
  @Input() roll!: SimpleRoll;

  constructor(private clipboard: Clipboard) {
    super();
  }

  copyMacro() {
    const rolls = this.roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
    const mods = this.roll.modifiers
      .map((m) => `${toModifier(m.value)}`)
      .join('');
    this.clipboard.copy(`Health: [[${rolls}${mods}]]`);
  }
}
