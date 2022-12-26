import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbilityNumberStruct } from 'src/app/model/character';
import { Skill } from 'src/app/model/skill';
import { AbilitySelectComponent } from '../ability-select/ability-select.component';

export interface SkillCheckEvent {
  skillIdentifier: string;
  skillRank: number;
  abilityIdentifier: string;
}
export interface SkillSetEvent {
  skillRank: number;
  skillName: string | null;
  skillIdentifier: string;
  defaultAbilities: string[];
}

@Component({
  selector: 'skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css', '../common.css'],
})
export class SkillComponent {
  @Input() skill!: Skill;
  @Input() proficiency!: number;
  @Input() abilityModifiers!: AbilityNumberStruct;
  @Input() custom: boolean = false;

  hovered: boolean = false;

  @Output() skillModified: EventEmitter<SkillSetEvent> = new EventEmitter();
  @Output() skillDeleted: EventEmitter<string> = new EventEmitter();
  @Output() roll: EventEmitter<SkillCheckEvent> = new EventEmitter(true);
  constructor(
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {}

  get skillModifier(): number {
    return Math.ceil((this.skill.rank * this.proficiency) / 2);
  }
  abilityModifier(id: string): number {
    return (this.abilityModifiers as unknown as { [key: string]: number })[id];
  }

  setRank(rank: number) {
    console.log('Edit ' + this.skill.identifier + ' = ' + rank);
    this.skill.rank = rank;
    this.skillModified.emit({
      skillRank: this.skill.rank,
      skillName: this.skill.name,
      skillIdentifier: this.skill.identifier,
      defaultAbilities: this.skill.defaultAbilities,
    });
  }

  callRoll(ability: string | null) {
    console.log('Roll ', ability);
    if (ability) {
      this.roll.emit({
        skillIdentifier: this.custom ? this.skill.name! : this.skill.identifier,
        abilityIdentifier: ability!,
        skillRank: this.skill.rank,
      });
    }
  }

  callCustomRoll() {
    this.changeDetector.detach();
    const dialogRef = this.dialog.open(AbilitySelectComponent, {
      data: {
        abilities: this.abilityModifiers,
        baseModifier: this.skillModifier,
      },
    });
    dialogRef.afterClosed().subscribe((a) => {
      this.callRoll(a);
      this.changeDetector.reattach();
    });
  }

  onHover() {
    this.hovered = true;
  }
  onHoverEnd() {
    this.hovered = false;
  }

  emitDelete() {
    this.skillDeleted.emit(this.skill.identifier);
  }

  onNameChanged(newName: string) {
    this.skillModified.emit({
      skillRank: this.skill.rank,
      skillName: newName,
      skillIdentifier: this.skill.identifier,
      defaultAbilities: this.skill.defaultAbilities,
    });
  }

  changeDefaultAbility(index: number) {
    if (!this.custom) {
      return;
    }
    this.changeDetector.detach();
    const dialogRef = this.dialog.open(AbilitySelectComponent, {
      data: {
        abilities: this.abilityModifiers,
        baseModifier: this.skillModifier,
      },
    });
    dialogRef.afterClosed().subscribe((a) => {
      if (!a) {
        return;
      }
      const abilities = this.skill.defaultAbilities;
      if (abilities.length > index) {
        abilities[index] = a;
      } else {
        abilities.push(a);
      }
      this.skillModified.emit({
        skillRank: this.skill.rank,
        skillName: this.skill.name,
        skillIdentifier: this.skill.identifier,
        defaultAbilities: abilities,
      });
    });
  }
}
