import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { SkillParams } from 'src/app/model/game-action';
import { randomIdString } from 'src/app/model/id-generator';
import { Skill } from 'src/app/model/skill';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SkillCheckEvent, SkillSetEvent } from '../skill/skill.component';
import { customSkillHash, skillHash, skillsArrayEqual } from './skillMemoUtils';

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
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  hilightId?: string;
  private defaultSkillsMemo: SkillsMemo = { memo: [], hash: 0 };
  private customSkillsMemo: SkillsMemo = { memo: [], hash: 0 };
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

  get customSkills(): Skill[] {
    const hash = customSkillHash(this.character);
    if (
      hash != this.customSkillsMemo.hash &&
      !skillsArrayEqual(this.character.customSkills, this.customSkillsMemo.memo)
    ) {
      this.customSkillsMemo.memo = this.character.customSkills.sort((a, b) =>
        a.name!.localeCompare(b.name!)
      );
      this.customSkillsMemo.hash = hash;
    }
    return this.customSkillsMemo.memo;
  }

  onModifySkill(event: SkillSetEvent) {
    this.character.setSkillByIdentifier(event.skillIdentifier, event.skillRank);
    this.character.customSkills = this.character.customSkills.map((s) =>
      s.identifier === event.skillIdentifier
        ? { ...s, name: event.skillName }
        : s
    );
    if (event.skillIdentifier === this.hilightId) {
      this.hilightId = undefined;
    }
    this.characterChanged.emit();
  }

  onDeleteSkill(skillIdentifier: string) {
    this.character.customSkills = this.character.customSkills.filter(
      (s) => s.identifier !== skillIdentifier
    );
    if (skillIdentifier === this.hilightId) {
      this.hilightId = undefined;
    }
    this.characterChanged.emit();
  }

  addSkill() {
    const id = randomIdString();
    this.character.customSkills = [
      ...this.character.customSkills,
      {
        identifier: id,
        name: 'New skill',
        rank: 0,
        defaultAbilities: [],
      },
    ];
    this.hilightId = id;
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
