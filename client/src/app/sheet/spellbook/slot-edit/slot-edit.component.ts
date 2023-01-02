import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SlotEditResult {
  regularSlots: { [key: number]: number };
  specialSlots: { [key: number]: number };
}
@Component({
  selector: 'slot-edit',
  templateUrl: './slot-edit.component.html',
  styleUrls: ['./slot-edit.component.css'],
})
export class SlotEditComponent {
  regularSlots!: { [key: number]: number };
  specialSlots!: { [key: number]: number };
  constructor(
    private dialogRef: MatDialogRef<SlotEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      regular: { [key: number]: number };
      special: { [key: number]: number };
    }
  ) {
    this.regularSlots = data.regular;
    this.specialSlots = data.special;
  }

  regular(tier: number): number {
    if (!this.regularSlots[tier]) {
      this.regularSlots[tier] = 0;
    }
    return this.regularSlots[tier];
  }
  special(tier: number): number {
    if (!this.specialSlots[tier]) {
      this.specialSlots[tier] = 0;
    }
    return this.specialSlots[tier];
  }

  setRegular(tier: number, value: string) {
    const parsed = Number.parseInt(value);
    if (isNaN(parsed)) {
      return;
    }
    this.regularSlots[tier] = Math.max(0, parsed);
  }
  setSpecial(tier: number, value: string) {
    const parsed = Number.parseInt(value);
    if (isNaN(parsed)) {
      return;
    }
    this.specialSlots[tier] = Math.max(0, parsed);
  }
  save() {
    const result: SlotEditResult = {
      regularSlots: this.regularSlots,
      specialSlots: this.specialSlots,
    };
    this.dialogRef.close(result);
  }
}
