import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttunementStatus, EquipStatus, Item } from 'src/app/model/item';

@Component({
  selector: 'item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css'],
})
export class ItemDetailsComponent {
  item: Item;
  colorized: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ItemDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: { item: Item }
  ) {
    this.item = data.item;
  }

  save() {
    this.dialogRef.close(this.item);
  }

  onAttunementCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.item.attunement = checked ? 'unattuned' : 'none';
  }
  onEquipmentCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.item.equipped = checked ? 'unequipped' : 'none';
  }

  onAttunementSelect(event: Event) {
    this.item.attunement = (event.target as HTMLSelectElement)
      .value as AttunementStatus;
  }
  onEquipmentSelect(event: Event) {
    this.item.equipped = (event.target as HTMLSelectElement)
      .value as EquipStatus;
  }
}
