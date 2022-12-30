import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbilityNumberStruct } from 'src/app/model/character';

@Component({
  selector: 'ability-select',
  templateUrl: './ability-select.component.html',
  styleUrls: [
    './ability-select.component.css',
    '../common.css',
    '../accessibility-common.css',
  ],
})
export class AbilitySelectComponent {
  abilities: AbilityNumberStruct;
  baseModifier: number;
  colorized: boolean;
  onSelection: EventEmitter<string> = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<AbilitySelectComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      abilities: AbilityNumberStruct;
      baseModifier: number;
      colorized: boolean;
    }
  ) {
    this.abilities = data.abilities;
    this.baseModifier = data.baseModifier;
    this.colorized = data.colorized;
  }

  dispatchClose(ability: string) {
    this.onSelection.emit(ability);
    this.dialogRef.close(ability);
  }
  get orderedAbilities(): { id: string; value: number; category: string }[] {
    return [
      { id: 'br', value: this.abilities.br, category: 'physical' },
      { id: 'dex', value: this.abilities.dex, category: 'physical' },
      { id: 'vit', value: this.abilities.vit, category: 'physical' },
      { id: 'int', value: this.abilities.int, category: 'mental' },
      { id: 'cun', value: this.abilities.cun, category: 'mental' },
      { id: 'res', value: this.abilities.res, category: 'mental' },
      { id: 'pre', value: this.abilities.pre, category: 'social' },
      { id: 'man', value: this.abilities.man, category: 'social' },
      { id: 'com', value: this.abilities.com, category: 'social' },
    ];
  }
}
