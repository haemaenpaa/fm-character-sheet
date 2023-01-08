import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { AoSelection } from 'src/app/model/ao-selection';
import { AO_HIT_DICE } from 'src/app/model/constants';

@Component({
  selector: 'ao-selection-item',
  templateUrl: './ao-selection-item.component.html',
  styleUrls: ['./ao-selection-item.component.css', '../common.css'],
})
export class AoSelectionItemComponent extends Hoverable {
  @Input() selection!: AoSelection;
  @Output() selectionChanged: EventEmitter<AoSelection> = new EventEmitter();
  @Output() selectionDeleted: EventEmitter<AoSelection> = new EventEmitter();
  knownAoNames: string[] = [];

  constructor() {
    super();
    for (const name in AO_HIT_DICE) {
      this.knownAoNames.push(name);
    }
    this.knownAoNames = this.knownAoNames.sort();
  }

  onFieldChanged(name: string, value: string) {
    const newSelection: AoSelection = { ...this.selection, [name]: value };
    console.log(`Field ${name} changed to ${value}`, newSelection);
    this.selectionChanged.emit(newSelection);
  }
  onLevelChanged(value: string) {
    const level = Number.parseInt(value);
    const isPrimary = level > 3 ? true : this.selection.isPrimary;
    if (!isNaN(level)) {
      this.selectionChanged.emit({ ...this.selection, level, isPrimary });
    }
  }
  onPrimaryToggle(event: Event) {
    const element = event.target as HTMLInputElement;
    this.selectionChanged.emit({
      ...this.selection,
      isPrimary: element.checked,
    });
  }
  onDelete() {
    this.selectionDeleted.emit(this.selection);
  }

  onAoSelected(event: Event) {
    const newAo = (event.target as HTMLSelectElement).value;
    if (newAo !== this.selection.abilityOrigin) {
      this.selectionChanged.emit({
        ...this.selection,
        abilityOrigin: newAo,
      });
    }
  }

  get hitDie(): string {
    if (this.selection.abilityOrigin in AO_HIT_DICE) {
      return 'd' + AO_HIT_DICE[this.selection.abilityOrigin];
    }
    return 'd?';
  }
}
