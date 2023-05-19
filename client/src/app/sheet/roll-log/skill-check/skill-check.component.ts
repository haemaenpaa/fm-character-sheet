import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { SKILL_DEFAULT_NAME } from 'src/app/model/constants';
import { SimpleRoll } from 'src/app/model/diceroll';
import { Roll20MacroService } from 'src/app/services/roll20-macro.service';

@Component({
  selector: 'skill-check',
  templateUrl: './skill-check.component.html',
  styleUrls: ['./skill-check.component.css', '../log-row-shared.css'],
})
export class SkillCheckComponent extends Hoverable {
  @Input('roll') roll!: SimpleRoll;

  constructor(
    private clipboard: Clipboard,
    private macroService: Roll20MacroService
  ) {
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
    this.clipboard.copy(this.macroService.getDiceAlgebra(this.roll));
  }
}
