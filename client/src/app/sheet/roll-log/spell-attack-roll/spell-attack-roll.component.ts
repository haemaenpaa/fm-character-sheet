import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { SimpleRoll } from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';

@Component({
  selector: 'spell-attack-roll',
  templateUrl: './spell-attack-roll.component.html',
  styleUrls: ['./spell-attack-roll.component.css', '../log-row-shared.css'],
})
export class SpellAttackRollComponent extends Hoverable {
  @Input() roll!: SimpleRoll;
  constructor(private clipboard: Clipboard) {
    super();
  }
  copyMacro() {
    const abl = this.roll.title!.split('_')[2];
    const rolls = this.roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
    const mods = this.roll.modifiers
      .map((m) => `${toModifier(m.value)}`)
      .join('');
    this.clipboard.copy(`/me makes a spell attack: [[${rolls}${mods}]]`);
  }
}
