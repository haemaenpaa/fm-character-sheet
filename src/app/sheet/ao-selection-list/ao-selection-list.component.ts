import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AoSelection } from 'src/app/model/ao-selection';

export interface SelectionChangeEvent {
  newSelection: AoSelection;
  oldSelection: AoSelection;
}

@Component({
  selector: 'ao-selection-list',
  templateUrl: './ao-selection-list.component.html',
  styleUrls: ['./ao-selection-list.component.css', '../common.css'],
})
export class AoSelectionListComponent {
  @Input() selections: AoSelection[] = [];
  @Output() selectionChanged: EventEmitter<SelectionChangeEvent> =
    new EventEmitter();
  @Output() selectionAdded: EventEmitter<AoSelection> = new EventEmitter();
  @Output() selectionDeleted: EventEmitter<AoSelection> = new EventEmitter();

  onSelectionAdd() {
    const selection: AoSelection = {
      abilityOrigin: '-',
      level: 0,
      name: 'New Ability',
      description: '',
      hilightColor: null,
      isPrimary: false,
    };
    this.selectionAdded.emit(selection);
  }

  onSelectionAltered(newSelection: AoSelection, oldSelection: AoSelection) {
    this.selectionChanged.emit({
      newSelection,
      oldSelection,
    });
  }

  onSelectionDeleted(selection: AoSelection) {
    this.selectionDeleted.emit(selection);
  }
}