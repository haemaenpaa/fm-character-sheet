import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbilityNumberStruct } from 'src/app/model/character';

@Component({
  selector: 'ability-select',
  templateUrl: './ability-select.component.html',
  styleUrls: ['./ability-select.component.css'],
})
export class AbilitySelectComponent {
  abilities: AbilityNumberStruct;
  baseModifier: number;
  onSelection: EventEmitter<string> = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<AbilitySelectComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      abilities: AbilityNumberStruct;
      baseModifier: number;
      callback: (value: string) => void;
    }
  ) {
    this.abilities = data.abilities;
    this.baseModifier = data.baseModifier;
  }

  dispatchClose(ability: string) {
    this.onSelection.emit(ability);
    this.dialogRef.close(ability);
  }
  get orderedAbilities(): { id: string; value: number }[] {
    return [
      { id: 'br', value: this.abilities.br },
      { id: 'dex', value: this.abilities.dex },
      { id: 'vit', value: this.abilities.vit },
      { id: 'int', value: this.abilities.int },
      { id: 'cun', value: this.abilities.cun },
      { id: 'res', value: this.abilities.res },
      { id: 'pre', value: this.abilities.pre },
      { id: 'man', value: this.abilities.man },
      { id: 'com', value: this.abilities.com },
    ];
  }
}
