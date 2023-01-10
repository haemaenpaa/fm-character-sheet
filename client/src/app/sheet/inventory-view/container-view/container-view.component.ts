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

  @Output() containerChanged: EventEmitter<InventoryContainer> =
    new EventEmitter();
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
    this.containerChanged.emit({
      ...this.container,
      contents: [...this.container.contents, item],
    });
  }

  onItemChange(oldItem: Item, newItem: Item) {
    if (newItem.quantity <= 0) {
      this.containerChanged.emit({
        ...this.container,
        contents: this.container.contents.filter((it) => it.id !== oldItem.id),
      });
    } else {
      this.containerChanged.emit({
        ...this.container,
        contents: this.container.contents.map((it) =>
          it.id !== oldItem.id ? it : newItem
        ),
      });
    }
  }

  onDescriptionChange(description: string) {
    this.containerChanged.emit({ ...this.container, description });
  }
  onNameChange(name: string) {
    this.containerChanged.emit({ ...this.container, name });
  }
}
