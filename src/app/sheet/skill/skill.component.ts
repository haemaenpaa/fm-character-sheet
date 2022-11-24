import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Skill } from 'src/app/model/skill';

export interface SkillCheckEvent {
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
  @Input() skill: Skill = {
    identifier: '',
    name: 'placeholder',
    rank: 3,
    defaultAbilities: ['dex', 'man'],
  };
  @Input() proficiency: number = 3;

  @Output() rankModified = new EventEmitter<SkillSetEvent>();
  @Output() roll = new EventEmitter<SkillSetEvent>();
  constructor() {}

  get skillModifier(): number {
    return Math.ceil((this.skill.rank * this.proficiency) / 2);
  }

  ngOnInit(): void {
    console.log(this.skill.defaultAbilities.length);
  }

  setRank(rank: number) {
    this.skill.rank = rank;
    this.rankModified.emit({
      skillRank: this.skill.rank,
      skillIdentifier: this.skill.identifier,
    });
  }

  callRoll(ability: string) {
    this.roll.emit({
      skillIdentifier: this.skill.identifier,
      skillRank: this.skill.rank,
    });
  }
}
