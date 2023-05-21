import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import { DamageRoll } from 'src/app/model/damage-roll';

/**
 * Popup component for editing a spell. The value returned is the newly edited spell.
 */
@Component({
  selector: 'spell-edit',
  templateUrl: './spell-edit.component.html',
  styleUrls: [
    './spell-edit.component.css',
    './spell-edit.component.accessibility.css',
    '../../common.css',
  ],
})
export class SpellEditComponent {
  /**
   * Spell schools.
   */
  availableSchools: string[] = [
    'Abjuration',
    'Conjuration',
    'Divination',
    'Enchantment',
    'Evocation',
    'Illusion',
    'Transmutation',
    'Vismancy',
  ];
  /**
   * Saving throw values and their names.
   */
  availableSaves: { key: string; value: string }[] = [
    { key: 'br', value: 'Brawn' },
    { key: 'dex', value: 'Dexterity' },
    { key: 'vit', value: 'Vitality' },
    { key: 'int/cun', value: 'Int/Cun' },
    { key: 'res', value: 'Resolve' },
    { key: 'pre/man', value: 'Pre/Man' },
  ];
  spell: Spell;
  colorized: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<SpellEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      spell: Spell;
    }
  ) {
    this.spell = data.spell;
  }

  save() {
    this.dialogRef.close(this.spell);
  }

  onSchoolSelect(event: Event) {
    this.spell.school = (event.target as HTMLSelectElement).value;
  }

  onSaveSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'null') {
      this.spell.saveAbility = undefined;
    } else {
      this.spell.saveAbility = value;
    }
  }

  setBool(
    event: Event,
    field:
      | 'ritual'
      | 'soulMastery'
      | 'concentration'
      | 'attack'
      | 'addCastingModifierToDamage'
  ) {
    this.spell[field] = (event.target as HTMLInputElement).checked;
  }

  onDieChanged(category: 'damage' | 'upcastDamage', roll: DamageRoll) {
    const damageList: DamageRoll[] = this.spell[category];
    const newList: DamageRoll[] = damageList.map((r: DamageRoll) =>
      r.id === roll.id ? roll : r
    );
    this.spell[category] = newList;
  }
  onDieDeleted(category: 'damage' | 'upcastDamage', roll: DamageRoll) {
    const damageList: DamageRoll[] = this.spell[category];
    const newList: DamageRoll[] = damageList.filter((r) => r.id !== roll.id);
    this.spell[category] = newList;
  }
}
