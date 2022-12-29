import { Component, Input, OnInit } from '@angular/core';
import { SKILL_DEFAULT_NAME } from 'src/app/model/constants';
import { Roll } from 'src/app/model/diceroll';

@Component({
  selector: 'skill-check',
  templateUrl: './skill-check.component.html',
  styleUrls: ['./skill-check.component.css', '../log-row-shared.css'],
})
export class SkillCheckComponent implements OnInit {
  @Input('roll') roll!: Roll;

  constructor() {}

  ngOnInit(): void {}

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
}
