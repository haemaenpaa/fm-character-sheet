import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';

@Component({
  selector: 'spell-details',
  templateUrl: './spell-details.component.html',
  styleUrls: ['./spell-details.component.css'],
})
export class SpellDetailsComponent {
  spell: Spell;
  constructor(
    dialogRef: MatDialogRef<SpellDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: { spell: Spell }
  ) {
    this.spell = data.spell;
  }

  get saves(): string[] {
    if (!this.spell.saveAbility) {
      return [];
    }
    return this.spell.saveAbility!.split('/');
  }
}
