import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { ABILITY_TO_NAME } from 'src/app/model/constants';
import { Roll, SimpleRoll } from 'src/app/model/diceroll';
import { article } from 'src/app/utils/grammar-utils';
import { toModifier } from 'src/app/utils/modifier-utils';

/**
 * A simple check component. Displays the name of the check, followed by the roll.
 */
@Component({
  selector: 'simple-check',
  templateUrl: './simple-check.component.html',
  styleUrls: ['./simple-check.component.css', '../log-row-shared.css'],
})
export class SimpleCheckComponent extends Hoverable {
  @Input('roll') roll!: SimpleRoll;
  constructor(private clipboard: Clipboard) {
    super();
  }
  copyMacro() {
    const abilityName = ABILITY_TO_NAME[this.roll.title!];
    const rolls = this.roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
    const mods = this.roll.modifiers
      .map((m) => `${toModifier(m.value)}`)
      .join('');

    const englishArticle = article(abilityName);
    this.clipboard.copy(
      `/me makes ${englishArticle} ${abilityName} check : [[${rolls}${mods}]]`
    );
  }
}
