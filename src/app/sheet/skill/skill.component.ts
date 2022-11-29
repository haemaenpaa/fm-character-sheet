import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Skill } from 'src/app/model/skill';

export interface SkillCheckEvent {
  skillIdentifier: string;
  skillRank: number;
  abilityIdentifier: string;
}
export interface SkillSetEvent {
  skillRank: number;
  skillIdentifier: string;
}

@Component({
  selector: 'skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
})
export class SkillComponent implements OnInit {
  @Input() skill!: Skill;
  @Input() proficiency!: number;
  @Input() abilityModifiers!: { [key: string]: number };

  @Output() rankModified: EventEmitter<SkillSetEvent> = new EventEmitter();
  @Output() roll: EventEmitter<SkillCheckEvent> = new EventEmitter();
  constructor() {}

  get skillModifier(): number {
    return Math.ceil((this.skill.rank * this.proficiency) / 2);
  }

  ngOnInit(): void {}

  setRank(rank: number) {
    console.log('Edit ' + this.skill.identifier + ' = ' + rank);
    this.skill.rank = rank;
    this.rankModified.emit({
      skillRank: this.skill.rank,
      skillIdentifier: this.skill.identifier,
    });
  }

  callRoll(ability: string) {
    this.roll.emit({
      skillIdentifier: this.skill.identifier,
      abilityIdentifier: ability,
      skillRank: this.skill.rank,
    });
  }
}
