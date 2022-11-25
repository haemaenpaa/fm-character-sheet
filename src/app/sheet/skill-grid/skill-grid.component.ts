import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';
import { SkillParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SkillCheckEvent, SkillSetEvent } from '../skill/skill.component';

@Component({
  selector: 'skill-grid',
  templateUrl: './skill-grid.component.html',
  styleUrls: ['./skill-grid.component.css'],
})
export class SkillGridComponent implements OnInit {
  @Input() character!: Character;
  constructor(private actionService: ActionDispatchService) {}

  ngOnInit(): void {}

  get abilityModifiers(): { [key: string]: number } {
    return this.character.abilityModifiers as unknown as {
      [key: string]: number;
    };
  }

  onModifyRank(event: SkillSetEvent) {
    this.character.setSkillByIdentifier(event.skillIdentifier, event.skillRank);
  }
  onSkillRoll(event: SkillCheckEvent) {
    console.log('Skill check', JSON.stringify(event));

    const skillParams: SkillParams = {
      characterName: this.character.name,
      abilityIdentifier: event.abilityIdentifier,
      abilityModifier: this.abilityModifiers[event.abilityIdentifier],
      skillIdentifier: event.skillIdentifier,
      skillModifier:
        this.character.proficiency * Math.ceil(event.skillRank / 2),
      advantage: 'none',
    };
    this.actionService.dispatch({
      type: 'skill-check',
      params: skillParams,
    });
  }
}
