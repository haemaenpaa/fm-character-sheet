import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AoSelection } from 'src/app/model/ao-selection';
import { AO_HIT_DICE } from 'src/app/model/constants';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'ao-selection-edit',
  templateUrl: './ao-selection-edit.component.html',
  styleUrls: ['./ao-selection-edit.component.css'],
})
export class AoSelectionEditComponent {
  selection: AoSelection;
  knownAoNames: string[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AoSelectionEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    data: {
      selection: AoSelection;
    }
  ) {
    for (const name in AO_HIT_DICE) {
      this.knownAoNames.push(name);
    }
    this.knownAoNames = this.knownAoNames.sort();
    this.selection = data.selection;
  }

  onFieldChanged(
    name: 'abilityOrigin' | 'name' | 'description',
    value: string
  ) {
    this.selection[name] = value;
  }

  onSelectColor() {
    console.log('Select color.');
    const dialogRef = this.dialog.open(ColorPickerComponent);
    dialogRef.afterClosed().subscribe((c) => {
      this.onHilightColorChanged(c);
    });
  }

  onHilightColorChanged(newColor?: string) {
    if (!newColor) {
      return;
    }
    if (newColor.length > 0) {
      const style = new Option().style;
      style.color = newColor;
      this.selection.hilightColor = style.color;
    } else {
      this.selection.hilightColor = null;
    }
  }

  onLevelChanged(value: string) {
    const level = Number.parseInt(value);
    if (!isNaN(level)) {
      const isPrimary = level > 3 ? true : this.selection.isPrimary;
      this.selection.level = level;
      this.selection.isPrimary = isPrimary;
    }
  }
  onPrimaryToggle(event: Event) {
    const element = event.target as HTMLInputElement;
    this.selection.isPrimary = element.checked;
  }

  onAoSelected(event: Event) {
    this.selection.abilityOrigin = (event.target as HTMLSelectElement).value;
  }

  get hitDie(): string {
    if (this.selection.abilityOrigin in AO_HIT_DICE) {
      return 'd' + AO_HIT_DICE[this.selection.abilityOrigin];
    }
    return 'd?';
  }

  save() {
    this.dialogRef.close(this.selection);
  }
}
