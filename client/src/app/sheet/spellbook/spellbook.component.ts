import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Character from 'src/app/model/character';
import { Spell } from 'src/app/model/character-spells';
import { SpellAttackParams } from 'src/app/model/game-action';
import { ActionDispatchService } from 'src/app/services/action-dispatch.service';
import { SpellService } from 'src/app/services/spell.service';
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
    './spellbook.component.accessibility.css',
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
    private actionService: ActionDispatchService,
    private spellService: SpellService
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
        const old = this.character.spells.spellcastingAbility;
        this.character.spells.spellcastingAbility = abl;
        this.spellService
          .updateSpellBook(this.character.spells, this.character.id!)
          .catch((err) => {
            console.log('Could not set spellcasting ability', err);
            this.character.spells.spellcastingAbility = old;
          });
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
    const oldSlotsAvailable = { ...this.character.spells.spellSlotsAvailable };
    const oldSpecialAvailable = {
      ...this.character.spells.specialSlotsAvailable,
    };
    const oldSouls = { ...this.character.spells.souls };
    this.character.spells.specialSlotsAvailable[tier] =
      event.specialSlotsAvailable;
    this.character.spells.spellSlotsAvailable[tier] = event.slotsAvailable;
    this.character.spells.souls[tier] = event.souls;
    this.spellService
      .updateSpellBook(this.character.spells, this.character.id!)
      .catch((err) => {
        console.log(
          'Failed to update spellbook. Resetting to pre-update state.',
          err
        );
        this.character.spells.specialSlotsAvailable = oldSpecialAvailable;
        this.character.spells.spellSlotsAvailable = oldSlotsAvailable;
        this.character.spells.souls = oldSouls;
      })
      .then((_) => {
        this.characterChanged.emit();
      });
  }

  addSpell(spell: Spell) {
    if (!this.character.spells.spells[spell.tier]) {
      this.character.spells.spells[spell.tier] = [];
    }
    const old = [...this.character.spells.spells[spell.tier]];
    this.character.spells.spells[spell.tier].push(spell);
    this.spellService
      .addSpell(spell, this.character.id!, this.character.spells.id)
      .catch((_) => {
        this.character.spells.spells[spell.tier] = old;
      })
      .then((_) => {
        this.characterChanged.emit();
      });
  }

  editSlots() {
    const dialog = this.dialog.open(SlotEditComponent, {
      data: {
        regular: { ...this.character.spells.spellSlots },
        special: { ...this.character.spells.specialSlots },
      },
    });
    dialog.afterClosed().subscribe((result: SlotEditResult) => {
      const oldSlotsAvailable = {
        ...this.character.spells.spellSlotsAvailable,
      };
      const oldSpecialAvailable = {
        ...this.character.spells.specialSlotsAvailable,
      };
      const oldSlots = { ...this.character.spells.spellSlots };
      const oldSpecial = { ...this.character.spells.specialSlotsAvailable };

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
      this.spellService
        .updateSpellBook(this.character.spells, this.character.id!)
        .catch((error) => {
          this.character.spells.specialSlots = oldSpecial;
          this.character.spells.spellSlots = oldSlots;
          this.character.spells.spellSlotsAvailable = oldSlotsAvailable;
          this.character.spells.specialSlotsAvailable = oldSpecialAvailable;
        })
        .then(() => {
          this.characterChanged.emit();
        });
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
    debugger;
    if (newTier !== oldTier) {
      this.changeSpellTier(event.old, event.new);
    } else {
      const spellList = this.character.spells.spells[oldTier];
      const oldSpells = [...spellList];
      this.character.spells.spells[oldTier] = spellList.map((s) =>
        s.id !== spellId ? s : event.new!
      );
      this.spellService
        .updateSpell(event.new, this.character.id!)
        .catch((_) => {
          this.character.spells.spells[oldTier] = oldSpells;
        })
        .then((_) => this.characterChanged.emit());
    }
  }

  deleteSpell(spell: Spell) {
    const oldValue = [...this.character.spells.spells[spell.tier]];
    this.character.spells.spells[spell.tier] = this.character.spells.spells[
      spell.tier
    ].filter((s) => s.id !== spell.id);
    this.spellService
      .deleteSpell(spell.id, this.character.id!)
      .catch((err) => {
        console.error(err);
        this.character.spells.spells[spell.tier] = oldValue;
      })
      .then((_) => this.characterChanged.emit());
  }

  changeSpellTier(oldSpell: Spell, newSpell: Spell) {
    debugger;
    const oldOriginList = [...this.character.spells.spells[oldSpell.tier]];

    this.character.spells.spells[oldSpell.tier] = this.character.spells.spells[
      oldSpell.tier
    ].filter((s) => s.id !== oldSpell.id);

    debugger;
    if (!this.character.spells.spells[newSpell.tier]) {
      this.character.spells.spells[newSpell.tier] = [];
    }

    const oldTargetList = [...this.character.spells.spells[newSpell.tier]];

    this.character.spells.spells[newSpell.tier] = [
      ...this.character.spells.spells[newSpell.tier],
      newSpell,
    ];
    this.spellService
      .updateSpell(newSpell, this.character.id!)
      .catch((_) => {
        this.character.spells.spells[oldSpell.tier] = oldOriginList;
        this.character.spells.spells[newSpell.tier] = oldTargetList;
      })
      .then((_) => {
        this.characterChanged.emit();
      });
  }
}
