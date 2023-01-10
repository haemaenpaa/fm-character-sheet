import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hoverable } from 'src/app/common/hoverable';
import { Item } from 'src/app/model/item';
import { ItemDetailsComponent } from '../item-details/item-details.component';

@Component({
  selector: 'item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css'],
})
export class ItemViewComponent extends Hoverable {
  @Input() item!: Item;
  @Input() colorized: boolean = false;
  @Output() itemChanged: EventEmitter<Item> = new EventEmitter();
  constructor(private dialog: MatDialog) {
    super();
  }

  toggleAttunement() {
    this.itemChanged.emit({
      ...this.item,
      attunement: this.item.attunement === 'attuned' ? 'unattuned' : 'attuned',
    });
  }

  toggleEquipment() {
    this.itemChanged.emit({
      ...this.item,
      equipped: this.item.equipped === 'equipped' ? 'unequipped' : 'equipped',
    });
  }

  edit() {
    const dialogRef = this.dialog.open(ItemDetailsComponent, {
      data: { item: { ...this.item } },
    });
    dialogRef.componentInstance.colorized = this.colorized;
    dialogRef.afterClosed().subscribe((newItem) => {
      if (newItem) {
        this.itemChanged.emit(newItem);
      }
    });
  }

  onQuantityChange(quantity: number) {
    this.itemChanged.emit({ ...this.item, quantity });
  }
}
