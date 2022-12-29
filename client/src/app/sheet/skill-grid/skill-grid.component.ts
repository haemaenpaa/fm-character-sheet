import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { SkillParams } from 'src/app/model/game-action';
import { Skill } from 'src/app/model/skill';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SkillCheckEvent, SkillSetEvent } from '../skill/skill.component';
import { skillHash, skillsArrayEqual } from './skillMemoUtils';

const IDENT_MAX = Number.MAX_SAFE_INTEGER;

interface SkillsMemo {
  memo: Skill[];
  hash: number;
}

@Component({
  selector: 'skill-grid',
  templateUrl: './skill-grid.component.html',
  styleUrls: ['./skill-grid.component.css', '../common.css'],
})
export class SkillGridComponent implements OnInit {
  @Input() character!: Character;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  private defaultSkillsMemo: SkillsMemo = { memo: [], hash: 0 };
  constructor(private actionService: ActionDispatchService) {}

  ngOnInit(): void {}

  get abilityModifiers(): { [key: string]: number } {
    return this.character.getAbilityModifiers() as unknown as {
      [key: string]: number;
    };
  }
  get defaultSkills(): Skill[] {
    const hash = skillHash(this.character);
    if (
      hash != this.defaultSkillsMemo.hash &&
      !skillsArrayEqual(
        this.character.getDefaultSkills(),
        this.defaultSkillsMemo.memo
      )
    ) {
      this.defaultSkillsMemo.memo = this.character.getDefaultSkills();
      this.defaultSkillsMemo.hash = hash;
    }
    return this.defaultSkillsMemo.memo;
  }

  onModifySkill(event: SkillSetEvent) {
    this.character.setSkillByIdentifier(event.skillIdentifier, event.skillRank);
    this.character.customSkills = this.character.customSkills.map((s) =>
      s.identifier === event.skillIdentifier
        ? { ...s, name: event.skillName }
        : s
    );
    this.characterChanged.emit();
  }

  onDeleteSkill(skillIdentifier: string) {
    this.character.customSkills = this.character.customSkills.filter(
      (s) => s.identifier !== skillIdentifier
    );
    this.characterChanged.emit();
  }

  addSkill() {
    const idNumber = Math.floor(Math.random() * IDENT_MAX);
    this.character.customSkills = [
      ...this.character.customSkills,
      {
        identifier: `${idNumber}`,
        name: 'New skill',
        rank: 0,
        defaultAbilities: [],
      },
    ];
    this.characterChanged.emit();
  }

  onSkillRoll(event: SkillCheckEvent) {
    console.log('Skill check', JSON.stringify(event));

    const skillParams: SkillParams = {
      characterName: this.character.name,
      abilityIdentifier: event.abilityIdentifier,
      abilityModifier: this.abilityModifiers[event.abilityIdentifier],
      skillIdentifier: event.skillIdentifier,
      skillModifier: Math.ceil(
        (this.character.proficiency * event.skillRank) / 2
      ),
      advantage: 'none',
    };
    this.actionService.dispatch({
      type: 'skill-check',
      params: skillParams,
    });
  }
}
