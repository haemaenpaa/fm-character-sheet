import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AoSelection } from 'src/app/model/ao-selection';
import { randomId } from 'src/app/model/id-generator';
import { AoSelectionEditComponent } from '../ao-selection-edit/ao-selection-edit.component';

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
  @Input() characterLevel: number = 0;
  @Output() selectionChanged: EventEmitter<SelectionChangeEvent> =
    new EventEmitter();
  @Output() selectionAdded: EventEmitter<AoSelection> = new EventEmitter();
  @Output() selectionDeleted: EventEmitter<AoSelection> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  get missingSecondaries(): boolean {
    const primaries = this.selections.filter(
      (s) => s.isPrimary && s.level <= 3
    ).length;
    const secondaries = this.selections.filter(
      (s) => !s.isPrimary && s.level <= 3
    ).length;
    return secondaries < primaries;
  }

  onSelectionAdd() {
    const selection: AoSelection = {
      id: randomId(),
      abilityOrigin: 'Artistry',
      level: 0,
      name: 'New Ability',
      description: '',
      hilightColor: null,
      isPrimary: true,
      takenAtLevel: this.characterLevel + 1,
    };
    this.openSelectionAddDialog(selection);
  }

  onSecondarySelectionAdd() {
    const selection: AoSelection = {
      id: randomId(),
      abilityOrigin: 'Artistry',
      level: 0,
      name: 'New Ability',
      description: '',
      hilightColor: null,
      isPrimary: false,
      takenAtLevel: this.characterLevel,
    };

    this.openSelectionAddDialog(selection);
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
  private openSelectionAddDialog(selection: AoSelection) {
    const dialogRef = this.dialog.open(AoSelectionEditComponent, {
      data: { selection },
    });
    dialogRef.afterClosed().subscribe((s) => {
      if (s) {
        this.selectionAdded.emit(selection);
      }
    });
  }
}
