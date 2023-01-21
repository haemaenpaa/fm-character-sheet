import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hoverable } from 'src/app/common/hoverable';
import { AoSelection } from 'src/app/model/ao-selection';
import { AO_HIT_DICE } from 'src/app/model/constants';
import { AoSelectionEditComponent } from '../ao-selection-edit/ao-selection-edit.component';

@Component({
  selector: 'ao-selection-item',
  templateUrl: './ao-selection-item.component.html',
  styleUrls: ['./ao-selection-item.component.css', '../common.css'],
})
export class AoSelectionItemComponent extends Hoverable {
  @Input() selection!: AoSelection;
  @Input() availableAos: string[] = [];
  @Output() selectionChanged: EventEmitter<AoSelection> = new EventEmitter();
  @Output() selectionDeleted: EventEmitter<AoSelection> = new EventEmitter();

  constructor(private dialog: MatDialog) {
    super();
  }

  onEdit() {
    const dialogRef = this.dialog.open(AoSelectionEditComponent, {
      data: { selection: { ...this.selection }, aoNames: this.availableAos },
    });

    dialogRef.afterClosed().subscribe((s) => {
      if (s) {
        this.selectionChanged.emit(s);
      }
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
