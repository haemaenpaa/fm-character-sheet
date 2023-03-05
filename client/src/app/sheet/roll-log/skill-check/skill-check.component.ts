import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { ABILITY_TO_NAME, SKILL_DEFAULT_NAME } from 'src/app/model/constants';
import { SimpleRoll } from 'src/app/model/diceroll';
import { toModifier } from 'src/app/utils/modifier-utils';

@Component({
  selector: 'skill-check',
  templateUrl: './skill-check.component.html',
  styleUrls: ['./skill-check.component.css', '../log-row-shared.css'],
})
export class SkillCheckComponent extends Hoverable {
  @Input('roll') roll!: SimpleRoll;

  constructor(private clipboard: Clipboard) {
    super();
  }
  get skillName(): string {
    if (!this.roll.title) {
      return 'UNKNOWN';
    }
    const skillId = this.roll.title?.split('_')[1];
    if (skillId in SKILL_DEFAULT_NAME) {
      return SKILL_DEFAULT_NAME[skillId];
    }
    return skillId;
  }

  copyMacro() {
    const abl = this.roll.title!.split('_')[2];
    const rolls = this.roll.dice.map((d) => `${d.dice}d${d.sides}`).join('+');
    const mods = this.roll.modifiers
      .map((m) => `${toModifier(m.value)}`)
      .join('');
    this.clipboard.copy(
      `/me makes a ${this.skillName} (${ABILITY_TO_NAME[abl]}) check : [[${rolls}${mods}]]`
    );
  }
}
