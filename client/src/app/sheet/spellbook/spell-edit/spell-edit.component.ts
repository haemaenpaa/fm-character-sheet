import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import { DamageRoll } from 'src/app/model/damage-roll';

@Component({
  selector: 'spell-edit',
  templateUrl: './spell-edit.component.html',
  styleUrls: ['./spell-edit.component.css'],
})
export class SpellEditComponent {
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
  availableSaves: { [key: string]: string } = {
    br: 'Brawn',
    dex: 'Dexterity',
    'int/cun': 'Int/Cun',
    res: 'Resolve',
    'pre/man': 'Pre/Man',
  };
  spell: Spell;
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
      this.spell.saveAbility = null;
    } else {
      this.spell.saveAbility = value;
    }
  }

  setTier(strValue: string) {
    const newValue = Number.parseInt(strValue);
    if (!isNaN(newValue)) {
      this.spell.tier = newValue;
    }
  }

  setBool(event: Event, field: 'ritual' | 'soulMastery') {
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