import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { SkillParams } from 'src/app/model/game-action';
import { randomIdString } from 'src/app/model/id-generator';
import { Skill } from 'src/app/model/skill';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SkillService } from 'src/app/services/skill.service';
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
  constructor(
    private actionService: ActionDispatchService,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {}

  get abilityModifiers(): { [key: string]: number } {
    return this.character.getAbilityModifiers() as unknown as {
      [key: string]: number;
    };
  }
  get defaultSkills(): Skill[] {
    const hash = skillHash(this.character);
    if (
      hash != this.defaultSkillsMemo.hash ||
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
    if (
      !skillsArrayEqual(this.character.customSkills, this.customSkillsMemo.memo)
    ) {
      this.customSkillsMemo.memo = this.character.customSkills.sort((a, b) =>
        a.name!.localeCompare(b.name!)
      );
    }
    return this.customSkillsMemo.memo;
  }

  onModifySkill(event: SkillSetEvent) {
    if (event.skillIdentifier in this.character.defaultSkills) {
      this.modifyDefaultSkill(event);
    } else {
      this.modifyCustomSkill(event);
    }
  }

  private modifyCustomSkill(event: SkillSetEvent) {
    const oldSkills = [...this.character.customSkills];
    const oldHilightId = this.hilightId;
    this.character.setSkillByIdentifier(event.skillIdentifier, event.skillRank);
    const updateIndex = this.character.customSkills.findIndex(
      (s) => s.identifier === event.skillIdentifier
    );

    this.character.customSkills = this.character.customSkills.map((s) =>
      s.identifier === event.skillIdentifier
        ? {
            ...s,
            name: event.skillName,
            rank: event.skillRank,
            defaultAbilities: event.defaultAbilities,
          }
        : s
    );
    if (event.skillIdentifier === this.hilightId) {
      this.hilightId = undefined;
    }
    this.skillService
      .updateSkill(this.character.customSkills[updateIndex], this.character.id!)
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to update skill', error);
          this.character.customSkills = oldSkills;
          this.hilightId = oldHilightId;
        }
      );

    console.log(oldSkills, this.character.customSkills);
  }

  private modifyDefaultSkill(event: SkillSetEvent) {
    const oldSkills = { ...this.character.defaultSkills };
    (this.character.defaultSkills as any)[event.skillIdentifier] =
      event.skillRank;
    this.skillService
      .updateDefaultSkills(
        { [event.skillIdentifier]: event.skillRank },
        this.character.id!
      )
      .then(
        (_) => this.characterChanged.emit(),
        (error) => {
          console.error('Failed to update defaulk skills');
          this.character.defaultSkills = oldSkills;
        }
      );
  }

  onDeleteSkill(skillIdentifier: string) {
    const oldSkills = [...this.character.customSkills];
    const oldHilightId = this.hilightId;
    this.character.customSkills = this.character.customSkills.filter(
      (s) => s.identifier !== skillIdentifier
    );
    if (skillIdentifier === this.hilightId) {
      this.hilightId = undefined;
    }
    this.skillService.deleteSkill(skillIdentifier, this.character.id!).then(
      (_) => this.characterChanged.emit(),
      (error) => {
        console.error('Could not delete skill', error);
        this.character.customSkills = oldSkills;
        this.hilightId = oldHilightId;
      }
    );
  }

  addSkill() {
    const oldHilightId = this.hilightId;
    const oldSkills = [...this.character.customSkills];
    const id = randomIdString();
    const created = {
      identifier: id,
      name: 'New skill',
      rank: 0,
      defaultAbilities: [],
    };
    this.character.customSkills = [...this.character.customSkills, created];
    this.hilightId = id;
    this.skillService.createSkill(created, this.character.id!).then(
      (_) => this.characterChanged.emit(),
      (error) => {
        console.error('Could not create skill', error);
        this.character.customSkills = oldSkills;
        this.hilightId = oldHilightId;
      }
    );
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
      advantage: event.advantage,
    };
    this.actionService.dispatch({
      type: 'skill-check',
      params: skillParams,
    });
  }
}
