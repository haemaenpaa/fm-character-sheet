import { Component, Inject } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spell } from 'src/app/model/character-spells';
import Character from 'src/app/model/character';
import { Advantage, SpellParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';

@Component({
  selector: 'spell-cast',
  templateUrl: './spell-cast.component.html',
  styleUrls: [
    './spell-cast.component.css',
    './spell-cast.component.accessibility.css',
  ],
})
export class SpellCastComponent {
  character?: Character;
  spell: Spell;
  tier: number;
  ritual: boolean = false;
  soulCheckAdvantage: Advantage = 'none';
  attackAdvantage: Advantage = 'none';
  advantageOptions: Advantage[] = ['none', 'advantage', 'disadvantage'];
  colorized: boolean = false;

  constructor(
    characterService: CharacterService,
    private actionDispatch: ActionDispatchService,
    private dialogRef: MatDialogRef<SpellCastComponent>,
    @Inject(MAT_DIALOG_DATA)
    data: {
      spell: Spell;
      characterId: number;
    }
  ) {
    characterService.getCharacterById(data.characterId).then((c) => {
      this.character = c;
      if (this.spell.tier === 0 && !this.spell.attack) {
        this.cast();
      }
    });
    this.spell = data.spell;
    this.tier = this.spell.tier;
  }
  cast() {
    if (!this.character) {
      return;
    }
    const params: SpellParams = {
      characterId: this.character!.id!,
      spellTier: this.spell.tier,
      castingTier: this.tier,
      spellId: this.spell.id,
      soulCheck: this.spell.tier > 0 && !this.ritual,
      advantage: {
        soulCheck: this.soulCheckAdvantage,
        attack: this.attackAdvantage,
      },
    };
    this.actionDispatch.dispatch({ type: 'spell', params });
    this.dialogRef.close(true);
  }

  get availableTiers(): number[] {
    const ret: number[] = [];
    if (this.character) {
      for (var spellTier = this.spell.tier; spellTier <= 9; spellTier++) {
        const regularAvailable =
          this.character!.spells.spellSlotsAvailable[spellTier] || 0;
        const specialAvailable =
          this.character!.spells.specialSlotsAvailable[spellTier] || 0;
        if (regularAvailable + specialAvailable > 0) {
          ret.push(spellTier);
        }
      }
    }

    return ret.sort();
  }

  onTierChange(event: Event) {
    this.tier = Number.parseInt((event.target as HTMLSelectElement).value);
  }

  onRitualChange(event: Event) {
    this.ritual = (event.target as HTMLInputElement).checked;
    if (this.ritual) {
      this.soulCheckAdvantage = 'none';
    }
  }

  onAdvantageChange(event: Event) {
    const advantage: Advantage = (event.target as HTMLSelectElement)
      .value as Advantage;
    switch ((event.target as HTMLSelectElement).id) {
      case 'attackAdvantage':
        this.attackAdvantage = advantage;
        break;
      case 'soulCheckAdvantage':
        this.soulCheckAdvantage = advantage;
        break;
    }
  }
}
