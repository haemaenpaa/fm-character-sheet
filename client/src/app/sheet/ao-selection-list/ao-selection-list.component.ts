import { SafeKeyedRead } from '@angular/compiler';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AoSelection } from 'src/app/model/ao-selection';
import { AO_HIT_DICE } from 'src/app/model/constants';
import { randomId } from 'src/app/model/id-generator';
import { AoSelectionEditComponent } from '../ao-selection-edit/ao-selection-edit.component';
import { AoSelectionSort, SortSelectionsPipe } from './sort-selections.pipe';

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
  @Input() sortOrder: AoSelectionSort = 'character-level';
  selections_: AoSelection[] = [];
  availableAos: string[] = [];
  @Input() characterLevel: number = 0;
  @Output() selectionChanged: EventEmitter<SelectionChangeEvent> =
    new EventEmitter();
  @Output() selectionAdded: EventEmitter<AoSelection> = new EventEmitter();
  @Output() selectionDeleted: EventEmitter<AoSelection> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  @Input() set selections(selections: AoSelection[]) {
    this.selections_ = selections;
    const uniqueAos = this.selections_
      .map((s) => s.abilityOrigin)
      .reduce((uniques: string[], current: string) => {
        if (!uniques.some((s) => s === current)) {
          return [...uniques, current];
        }
        return uniques;
      }, []);

    if (uniqueAos.length >= 4) {
      this.availableAos = uniqueAos.sort();
    } else {
      this.availableAos = Object.keys(AO_HIT_DICE).sort();
    }
  }
  get selections(): AoSelection[] {
    return this.selections_;
  }

  get missingSecondaries(): boolean {
    const primaries = this.selections.filter(
      (s) => s.isPrimary && s.level <= 3
    ).length;
    const secondaries = this.selections.filter(
      (s) => !s.isPrimary && s.level <= 3
    ).length;
    return secondaries < primaries;
  }

  get levelsMissingSecondaries(): number[] {
    const primaries = this.selections
      .filter((s) => s.isPrimary && s.level <= 3 && s.takenAtLevel != undefined)
      .map((s) => s.takenAtLevel!);
    const secondaries = this.selections
      .filter((s) => !s.isPrimary && s.takenAtLevel != undefined)
      .map((s) => s.takenAtLevel!);
    return primaries.filter((l) => !secondaries.find((lvl) => l === lvl));
  }

  onSelectionAdd() {
    const latestAo =
      this.selections
        .sort((a, b) => (b.takenAtLevel || 0) - (a.takenAtLevel || 0))
        .find((a) => a.takenAtLevel)?.abilityOrigin || 'Artistry';
    const selection: AoSelection = {
      id: randomId(),
      abilityOrigin: latestAo,
      level: this.characterLevel + 1,
      name: 'New Ability',
      description: '',
      isPrimary: true,
      takenAtLevel: this.characterLevel + 1,
    };
    this.openSelectionAddDialog(selection);
  }

  onSecondarySelectionAdd() {
    const primaries = this.selections.filter(
      (s) => s.isPrimary && s.level <= 3 && s.takenAtLevel != undefined
    );
    const secondaries = this.selections.filter(
      (s) => !s.isPrimary && s.takenAtLevel != undefined
    );
    const levelsForSecondaries = secondaries.map((s) => s.takenAtLevel!);
    const primariesWithoutSecondaries = primaries.filter(
      (sel) => !levelsForSecondaries.some((l) => l === sel.takenAtLevel)
    );
    const lowestMissing = primariesWithoutSecondaries.reduce(
      (sel: AoSelection | undefined, current: AoSelection) => {
        if (!sel || sel.takenAtLevel! > current.takenAtLevel!) {
          return current;
        }
        return sel;
      },
      undefined
    );
    debugger;
    const takenAtLevel =
      lowestMissing?.takenAtLevel ||
      this.levelsMissingSecondaries.reduce(
        (a: number, b: number) => Math.min(a, b),
        Number.POSITIVE_INFINITY
      );

    const latestAo = lowestMissing?.abilityOrigin || 'Artistry';

    const selection: AoSelection = {
      id: randomId(),
      abilityOrigin: latestAo,
      level: takenAtLevel,
      name: 'New Ability',
      description: '',
      isPrimary: false,
      takenAtLevel,
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
      data: { selection, aoNames: this.availableAos },
    });
    dialogRef.afterClosed().subscribe((s) => {
      if (s) {
        this.selectionAdded.emit(selection);
      }
    });
  }
}
