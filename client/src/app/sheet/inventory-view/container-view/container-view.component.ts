import { Component, EventEmitter, Input, Output } from '@angular/core';
import { randomId } from 'src/app/model/id-generator';
import { containerWeight, InventoryContainer, Item } from 'src/app/model/item';

@Component({
  selector: 'container-view',
  templateUrl: './container-view.component.html',
  styleUrls: ['./container-view.component.css', '../../common.css'],
})
export class ContainerViewComponent {
  @Input() container!: InventoryContainer;

  @Output() itemAdded: EventEmitter<Item> = new EventEmitter();
  get totalWeight() {
    return containerWeight(this.container);
  }

  addItem() {
    const item: Item = {
      id: randomId(),
      name: 'New Item',
      description: '',
      weight: 250,
      quantity: 1,
      attunement: 'none',
      equipped: 'none',
    };
    this.itemAdded.emit(item);
  }
}
