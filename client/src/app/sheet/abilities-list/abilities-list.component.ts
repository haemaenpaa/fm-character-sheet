import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AoSelection } from 'src/app/model/ao-selection';
import Character from 'src/app/model/character';
import { AO_HIT_DICE } from 'src/app/model/constants';
import { SelectionChangeEvent } from '../ao-selection-list/ao-selection-list.component';

@Component({
  selector: 'abilities-list',
  templateUrl: './abilities-list.component.html',
  styleUrls: ['./abilities-list.component.css'],
})
export class AbilitiesListComponent {
  @Input() character: Character | null = null;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();

  get hasRacialAbilities(): boolean {
    if (!this.character) {
      return false;
    }
    return Object.keys(this.character.race.abilities).length > 0;
  }

  onSelectionAdd(selection: AoSelection) {
    this.character!.selections = [...this.character!.selections, selection];
    this.characterChanged.emit();
  }
  onSelectionRemove(deleted: AoSelection) {
    if (!this.character) {
      return;
    }
    if (deleted.isPrimary) {
      this.decrementRemovedHitDice(deleted.abilityOrigin);
    }
    this.character.selections = this.character.selections.filter(
      (sel) => sel.id != deleted.id
    );
    this.characterChanged.emit();
  }
  onSelectionEdit(event: SelectionChangeEvent) {
    if (!this.character) {
      return;
    }
    console.log('onSelectionEdit', event);
    this.adjustHitDice(event);
    this.character.selections = this.character.selections.map((sel) =>
      sel.id === event.oldSelection.id ? event.newSelection : sel
    );

    this.characterChanged.emit();
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
    if (event.oldSelection.isPrimary) {
      this.decrementRemovedHitDice(oldAo);
    }
    if (newAo in AO_HIT_DICE && event.newSelection.isPrimary) {
      (this.character.hitDice as any)[AO_HIT_DICE[newAo]] += 1;
      const max = (this.character.hitDice as any)[AO_HIT_DICE[newAo]];
      const remaining = (this.character.hitDiceRemaining as any)[
        AO_HIT_DICE[newAo]
      ];
      (this.character.hitDiceRemaining as any)[AO_HIT_DICE[newAo]] = Math.min(
        max,
        remaining + 1
      );
    }
  }

  private decrementRemovedHitDice(oldAo: string) {
    if (!this.character) {
      return;
    }
    if (oldAo in AO_HIT_DICE) {
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
    }
  }
}
