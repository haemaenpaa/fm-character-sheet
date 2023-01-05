import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import { SpellCastComponent } from '../spell-cast/spell-cast.component';

/**
 * Popup dialog that displays the details of a spell.
 */
@Component({
  selector: 'spell-details',
  templateUrl: './spell-details.component.html',
  styleUrls: ['./spell-details.component.css'],
})
export class SpellDetailsComponent {
  spell: Spell;
  characterId: string;
  constructor(
    private dialogRef: MatDialogRef<SpellDetailsComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: { spell: Spell; characterId: string }
  ) {
    this.spell = data.spell;
    this.characterId = data.characterId;
  }

  get saves(): string[] {
    if (!this.spell.saveAbility) {
      return [];
    }
    return this.spell.saveAbility!.split('/');
  }

  cast() {
    const castDialog = this.dialog.open(SpellCastComponent, {
      data: {
        spell: this.spell,
        characterId: this.characterId,
      },
    });
    castDialog.afterClosed().subscribe((_) => this.dialogRef.close());
  }
}
