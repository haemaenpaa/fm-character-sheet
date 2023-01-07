import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AbilityNumberStruct } from 'src/app/model/character';
import CharacterAttack, { AttackEffect } from 'src/app/model/character-attack';
import { DamageRoll } from 'src/app/model/damage-roll';
import { randomId } from 'src/app/model/id-generator';
import { AbilitySelectComponent } from '../ability-select/ability-select.component';

@Component({
  selector: 'attack-edit',
  templateUrl: './attack-edit.component.html',
  styleUrls: ['./attack-edit.component.css', '../common.css'],
})
export class AttackEditComponent {
  attack!: CharacterAttack;
  abilities: AbilityNumberStruct;
  proficiency: number;
  colorized: boolean = false;
  /**
   * Saving throw values and their names.
   */
  availableSaves: { [key: string]: string } = {
    br: 'Brawn',
    dex: 'Dexterity',
    'int/cun': 'Int/Cun',
    res: 'Resolve',
    'pre/man': 'Pre/Man',
  };
  constructor(
    private dialogRef: MatDialogRef<AttackEditComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    data: {
      attack: CharacterAttack;
      abilities: AbilityNumberStruct;
      proficiency: number;
    }
  ) {
    this.attack = data.attack;
    this.abilities = data.abilities;
    this.proficiency = data.proficiency || 0;
  }

  save() {
    this.dialogRef.close(this.attack);
  }

  addAbility() {
    const abilitySelect = this.dialog.open(AbilitySelectComponent, {
      data: {
        abilities: this.abilities,
        baseModifier: 0,
        colorized: this.colorized,
      },
    });

    abilitySelect.afterClosed().subscribe((abl) => {
      if (abl && this.attack.abilities.indexOf(abl) < 0) {
        this.attack.abilities.push(abl);
      }
    });
  }
  removeAbility(ability: string) {
    this.attack.abilities = this.attack.abilities.filter((s) => s !== ability);
  }
  addEffect() {
    this.attack.effects.push({ id: randomId(), save: 'br', description: '' });
  }

  setBool(field: 'proficient' | 'offhand', event: Event) {
    this.attack[field] = (event.target as HTMLInputElement).checked;
  }

  removeDie(removed: DamageRoll) {
    this.attack.damage = this.attack.damage.filter((d) => d.id !== removed.id);
  }
  modifyDie(modified: DamageRoll) {
    this.attack.damage = this.attack.damage.map((d) =>
      d.id === modified.id ? modified : d
    );
  }
  setEffectSave(effect: AttackEffect, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'null') {
      effect.save = undefined;
    } else {
      effect.save = value;
    }
  }
  removeEffect(effect: AttackEffect) {
    this.attack.effects = this.attack.effects.filter((e) => e.id !== effect.id);
  }
}
