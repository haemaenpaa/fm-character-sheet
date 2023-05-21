import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import { SpellCastComponent } from '../spell-cast/spell-cast.component';
import Character from 'src/app/model/character';
import { CharacterService } from 'src/app/services/character.service';
import { toModifier } from 'src/app/utils/modifier-utils';

/**
 * Popup dialog that displays the details of a spell.
 */
@Component({
  selector: 'spell-details',
  templateUrl: './spell-details.component.html',
  styleUrls: [
    './spell-details.component.css',
    './spell-details.component.accessibility.css',
  ],
})
export class SpellDetailsComponent {
  spell: Spell;
  characterId: string;
  character?: Character;
  colorized: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<SpellDetailsComponent>,
    private dialog: MatDialog,
    characterService: CharacterService,
    @Inject(MAT_DIALOG_DATA) data: { spell: Spell; characterId: string }
  ) {
    this.spell = data.spell;
    this.characterId = data.characterId;
    characterService
      .getCachedCharacterById(Number.parseInt(this.characterId))
      .then((c) => (this.character = c));
  }

  get saves(): string[] {
    if (!this.spell.saveAbility) {
      return [];
    }
    return this.spell.saveAbility!.split('/');
  }

  get castingModifier(): string {
    return toModifier(this.character?.castingAbility?.modifier);
  }

  cast() {
    const castDialog = this.dialog.open(SpellCastComponent, {
      data: {
        spell: this.spell,
        characterId: this.characterId,
      },
    });
    castDialog.componentInstance.colorized = this.colorized;
    castDialog.afterClosed().subscribe((wasCast) => {
      if (wasCast) {
        this.dialogRef.close();
      }
    });
  }
}
