import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AoSelection } from 'src/app/model/ao-selection';
import Character from 'src/app/model/character';
import { AO_HIT_DICE } from 'src/app/model/constants';
import { AoSelectionService } from 'src/app/services/ao-selection.service';
import { HitDiceService } from 'src/app/services/hit-dice.service';
import { SelectionChangeEvent } from '../ao-selection-list/ao-selection-list.component';
import { AoSelectionSort } from '../ao-selection-list/sort-selections.pipe';

@Component({
  selector: 'abilities-list',
  templateUrl: './abilities-list.component.html',
  styleUrls: ['./abilities-list.component.css'],
})
export class AbilitiesListComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  constructor(
    private selectionService: AoSelectionService,
    private hitDiceService: HitDiceService
  ) {}
  selectionSort: AoSelectionSort = 'character-level';

  sortOptions = [
    { value: 'character-level', label: 'Character level' },
    { value: 'ao-level', label: 'Selection level' },
    { value: 'ao-name', label: 'Ability origin' },
    { value: 'name', label: 'Selection name' },
    { value: 'hilight-color', label: 'Hilight color' },
  ];

  get hasRacialAbilities(): boolean {
    if (!this.character) {
      return false;
    }
    return Object.keys(this.character.race.abilities).length > 0;
  }

  onSelectionAdd(selection: AoSelection) {
    const oldSelections = [...this.character.selections];
    const oldHitDice = { ...this.character.hitDice };
    const oldHitDiceRemaining = { ...this.character.hitDiceRemaining };

    this.character.selections = [...this.character.selections, selection];
    if (selection.isPrimary && selection.abilityOrigin in AO_HIT_DICE) {
      (this.character.hitDiceRemaining as any)[
        AO_HIT_DICE[selection.abilityOrigin]
      ] += 1;
      (this.character.hitDice as any)[
        AO_HIT_DICE[selection.abilityOrigin]
      ] += 1;

      this.updateHitDiceToBackend(oldHitDice, oldHitDiceRemaining);
    }

    this.selectionService
      .createSelection(selection, this.character.id!)
      .catch((err) => {
        this.character.selections = oldSelections;
        console.error('Could not add selection', err);
      })
      .then((res) => {
        if (res) {
          this.characterChanged.emit();
        }
      });
  }

  private updateHitDiceToBackend(
    oldHitDice: { 6: number; 8: number; 10: number; 12: number },
    oldHitDiceRemaining: { 6: number; 8: number; 10: number; 12: number }
  ) {
    this.hitDiceService
      .updateHitDice(this.character.hitDice, this.character.id!)
      .catch((error: any) => {
        console.error('Failed to set hit dice', error);
        this.character.hitDice = oldHitDice;
      });
    this.hitDiceService
      .updateHitDiceRemaining(
        this.character.hitDiceRemaining,
        this.character.id!
      )
      .catch((error: any) => {
        console.error('Failed to set hit dice remaining', error);
        this.character.hitDiceRemaining = oldHitDiceRemaining;
      });
  }

  onSelectionRemove(deleted: AoSelection) {
    const oldSelections = [...this.character.selections];
    const oldHitDice = { ...this.character.hitDice };
    const oldHitDiceRemianing = { ...this.character.hitDiceRemaining };

    if (deleted.isPrimary) {
      this.decrementRemovedHitDice(deleted.abilityOrigin);
    }
    this.character.selections = this.character.selections.filter(
      (sel) => sel.id != deleted.id
    );
    this.selectionService
      .deleteSelection(deleted.id, this.character.id!)
      .catch((err) => {
        console.error('Could not delete selection', err);
        this.character.selections = oldSelections;
        this.character.hitDice = oldHitDice;
        this.character.hitDiceRemaining = oldHitDiceRemianing;
      })
      .then(() => {
        this.characterChanged.emit();
      });
  }
  onSelectionEdit(event: SelectionChangeEvent) {
    const oldSelections = [...this.character.selections];
    const oldHitDice = { ...this.character.hitDice };
    const oldHitDiceRemaining = { ...this.character.hitDiceRemaining };

    console.log('onSelectionEdit', event);
    this.adjustHitDice(event);
    this.character.selections = this.character.selections.map((sel) =>
      sel.id === event.oldSelection.id ? event.newSelection : sel
    );
    this.selectionService
      .updateSelection(event.newSelection, this.character.id!)
      .catch((err) => {
        console.error('Could not update selection', err);
        this.character.selections = oldSelections;
        this.character.hitDice = oldHitDice;
        this.character.hitDiceRemaining = oldHitDiceRemaining;
      })
      .then((res) => {
        if (res) {
          this.characterChanged.emit();
        }
      });
  }

  private adjustHitDice(event: SelectionChangeEvent) {
    if (
      !this.character ||
      (!event.oldSelection.isPrimary && !event.newSelection.isPrimary)
    ) {
      return;
    }

    const oldAo = event.oldSelection.abilityOrigin;
    const newAo = event.newSelection.abilityOrigin;

    const hitDiceAdded = newAo in AO_HIT_DICE && event.newSelection.isPrimary;
    const oldHitDice = { ...this.character.hitDice };
    const oldHitDiceRemaining = { ...this.character.hitDiceRemaining };
    if (event.oldSelection.isPrimary) {
      this.decrementRemovedHitDice(oldAo, hitDiceAdded);
    }
    if (hitDiceAdded) {
      (this.character.hitDice as any)[AO_HIT_DICE[newAo]] += 1;
      const max = (this.character.hitDice as any)[AO_HIT_DICE[newAo]];
      const remaining = (this.character.hitDiceRemaining as any)[
        AO_HIT_DICE[newAo]
      ];
      (this.character.hitDiceRemaining as any)[AO_HIT_DICE[newAo]] = Math.min(
        max,
        remaining + 1
      );
      this.updateHitDiceToBackend(oldHitDice, oldHitDiceRemaining);
    }
  }

  private decrementRemovedHitDice(oldAo: string, skipBackend?: boolean) {
    if (!this.character) {
      return;
    }
    if (oldAo in AO_HIT_DICE) {
      const oldHitDice = { ...this.character.hitDice };
      const oldHitDiceRemaining = { ...this.character.hitDiceRemaining };

      const value = (this.character!.hitDice as any)[AO_HIT_DICE[oldAo]];
      (this.character.hitDice as any)[AO_HIT_DICE[oldAo]] = Math.max(
        0,
        value - 1
      );
      const remaining = (this.character.hitDiceRemaining as any)[
        AO_HIT_DICE[oldAo]
      ];
      (this.character.hitDiceRemaining as any)[AO_HIT_DICE[oldAo]] = Math.max(
        0,
        Math.min(value - 1, remaining)
      );
      if (!skipBackend) {
        this.updateHitDiceToBackend(oldHitDice, oldHitDiceRemaining);
      }
    }
  }

  onSortChange(event: Event) {
    this.selectionSort = (event.target as HTMLSelectElement)
      .value as AoSelectionSort;
  }
}
