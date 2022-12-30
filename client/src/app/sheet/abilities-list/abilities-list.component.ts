import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AoSelection } from 'src/app/model/ao-selection';
import Character from 'src/app/model/character';
import { SelectionChangeEvent } from '../ao-selection-list/ao-selection-list.component';

function aoSelectionEquals(a: AoSelection, b: AoSelection): boolean {
  if (a.level !== b.level) {
    return false;
  }
  if (a.abilityOrigin !== b.abilityOrigin) {
    return false;
  }
  if (a.name !== b.name) {
    return false;
  }
  if (a.isPrimary != b.isPrimary) {
    return false;
  }
  return true;
}

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
  onSelectionRemove(selection: AoSelection) {
    if (!this.character) {
      return;
    }
    this.character.selections = this.character.selections.filter(
      (sel) => !aoSelectionEquals(sel, selection)
    );
    this.characterChanged.emit();
  }
  onSelectionEdit(event: SelectionChangeEvent) {
    if (!this.character) {
      return;
    }
    console.log('onSelectionEdit', event);
    this.character.selections = this.character.selections.map((sel) =>
      aoSelectionEquals(sel, event.oldSelection) ? event.newSelection : sel
    );

    this.characterChanged.emit();
  }
}
