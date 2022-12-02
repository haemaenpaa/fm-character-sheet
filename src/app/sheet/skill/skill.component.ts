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
  skillIdentifier: string;
}

@Component({
  selector: 'skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
})
export class SkillComponent {
  @Input() skill!: Skill;
  @Input() proficiency!: number;
  @Input() abilityModifiers!: AbilityNumberStruct;

  @Output() rankModified: EventEmitter<SkillSetEvent> = new EventEmitter();
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
    this.rankModified.emit({
      skillRank: this.skill.rank,
      skillIdentifier: this.skill.identifier,
    });
  }

  callRoll(ability: string | null) {
    console.log('Roll ', ability);
    if (ability) {
      this.roll.emit({
        skillIdentifier: this.skill.identifier,
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
}
