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
  physical: boolean = true;
  mental: boolean = true;
  social: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AbilitySelectComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      abilities: AbilityNumberStruct;
      baseModifier?: number;
      colorized: boolean;
    }
  ) {
    this.abilities = data.abilities;
    this.baseModifier = data.baseModifier || 0;
    this.colorized = data.colorized;
  }

  dispatchClose(ability: string) {
    this.onSelection.emit(ability);
    this.dialogRef.close(ability);
  }

  get orderedAbilities(): { id: string; value: number; category: string }[] {
    const ret: { id: string; value: number; category: string }[] = [];
    if (this.physical) {
      ret.push({ id: 'br', value: this.abilities.br, category: 'physical' });
      ret.push({ id: 'dex', value: this.abilities.dex, category: 'physical' });
      ret.push({ id: 'vit', value: this.abilities.vit, category: 'physical' });
    }
    if (this.mental) {
      ret.push({ id: 'int', value: this.abilities.int, category: 'mental' });
      ret.push({ id: 'cun', value: this.abilities.cun, category: 'mental' });
      ret.push({ id: 'res', value: this.abilities.res, category: 'mental' });
    }
    if (this.social) {
      ret.push({ id: 'pre', value: this.abilities.pre, category: 'social' });
      ret.push({ id: 'man', value: this.abilities.man, category: 'social' });
      ret.push({ id: 'com', value: this.abilities.com, category: 'social' });
    }
    return ret;
  }
}
