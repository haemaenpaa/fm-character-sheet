import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Character from 'src/app/model/character';
import { Spell } from 'src/app/model/character-spells';
import { CheckParams, SpellAttackParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { AbilitySelectComponent } from '../ability-select/ability-select.component';
import {
  SlotEditComponent,
  SlotEditResult,
} from './slot-edit/slot-edit.component';
import {
  ResourceChangeEvent,
  SpellChangeEvent,
} from './spell-list/spell-list.component';

/**
 * Component that displays the spellcasting related information of the character.
 *
 * This includes spellcasting ability and the derived stats, souls and spells.
 */
@Component({
  selector: 'spellbook',
  templateUrl: './spellbook.component.html',
  styleUrls: [
    './spellbook.component.css',
    '../common.css',
    '../accessibility-common.css',
  ],
})
export class SpellbookComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  constructor(
    private dialog: MatDialog,
    private actionService: ActionDispatchService
  ) {}

  selectCastingAbility() {
    const dialogRef = this.dialog.open(AbilitySelectComponent, {
      data: {
        abilities: this.character.getAbilityModifiers(),
        baseModifier: this.character.proficiency,
        colorized: this.colorized,
      },
    });
    const selectComponent = dialogRef.componentInstance;
    selectComponent.physical = false;

    dialogRef.afterClosed().subscribe((abl) => {
      if (abl) {
        this.character.spells.spellcastingAbility = abl;
      }
      this.characterChanged.emit();
    });
  }

  callSpellAttack() {
    if (!this.character || !this.character.spells.spellcastingAbility) {
      return;
    }
    const params: SpellAttackParams = {
      characterName: this.character.name,
      advantage: 'none',
      abilityIdentifier: this.character.spells.spellcastingAbility,
      spellAttackBonus: this.character.spellAttack,
    };
    this.actionService.dispatch({
      type: 'spell-attack',
      params,
    });
  }

  modifyResources(tier: number, event: ResourceChangeEvent) {
    this.character.spells.specialSlotsAvailable[tier] =
      event.specialSlotsAvailable;
    this.character.spells.spellSlotsAvailable[tier] = event.slotsAvailable;
    this.character.spells.souls[tier] = event.souls;
    this.characterChanged.emit();
  }

  addSpell(spell: Spell) {
    if (!this.character.spells.spells[spell.tier]) {
      this.character.spells.spells[spell.tier] = [];
    }
    this.character.spells.spells[spell.tier].push(spell);
    this.characterChanged.emit();
  }

  editSlots() {
    const dialog = this.dialog.open(SlotEditComponent, {
      data: {
        regular: { ...this.character.spells.spellSlots },
        special: { ...this.character.spells.specialSlots },
      },
    });
    dialog.afterClosed().subscribe((result: SlotEditResult) => {
      this.character.spells.spellSlots = result.regularSlots;
      this.character.spells.specialSlots = result.specialSlots;
      for (const key in this.character.spells.spellSlotsAvailable) {
        if (
          this.character.spells.spellSlotsAvailable[key] >
          result.regularSlots[key]
        ) {
          this.character.spells.spellSlotsAvailable[key] =
            result.regularSlots[key];
        }
      }
      for (const key in this.character.spells.specialSlotsAvailable) {
        if (
          this.character.spells.specialSlotsAvailable[key] >
          result.specialSlots[key]
        ) {
          this.character.spells.specialSlotsAvailable[key] =
            result.specialSlots[key];
        }
      }
      this.characterChanged.emit();
    });
  }

  onSpellModified(event: SpellChangeEvent) {
    if (!event.new) {
      this.deleteSpell(event.old);
      return;
    }
    const spellId = event.old.id;
    const oldTier = event.old.tier;
    const newTier = event.new.tier;
    if (newTier !== oldTier) {
      this.changeSpellTier(event.old, event.new);
    } else {
      const spellList = this.character.spells.spells[oldTier];
      this.character.spells.spells[oldTier] = spellList.map((s) =>
        s.id !== spellId ? s : event.new!
      );
      this.characterChanged.emit();
    }
  }

  deleteSpell(spell: Spell) {
    this.character.spells.spells[spell.tier] = this.character.spells.spells[
      spell.tier
    ].filter((s) => s.id !== spell.id);
    this.characterChanged.emit();
  }

  changeSpellTier(oldSpell: Spell, newSpell: Spell) {
    this.character.spells.spells[oldSpell.tier] = this.character.spells.spells[
      oldSpell.tier
    ].filter((s) => s.id !== oldSpell.id);
    if (!this.character.spells.spells[newSpell.tier]) {
      this.character.spells.spells[newSpell.tier] = [];
    }
    this.character.spells.spells[newSpell.tier] = [
      ...this.character.spells.spells[newSpell.tier],
      newSpell,
    ];
    this.characterChanged.emit();
  }
}
