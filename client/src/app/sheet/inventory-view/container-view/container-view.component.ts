import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { randomId } from 'src/app/model/id-generator';
import { containerWeight, InventoryContainer, Item } from 'src/app/model/item';

const LIST_ID_EXPRESSION = /^items_\d+$/;

function getContainerId(elementId: string): number {
  if (!elementId.match(LIST_ID_EXPRESSION)![0]) {
    return NaN;
  }
  return Number.parseInt(elementId.split('_')[1]);
}

export interface ItemMoveEvent {
  sourceContainerId: number;
  destinationContainerId: number;
  itemId: number;
  index?: number;
}

@Component({
  selector: 'container-view',
  templateUrl: './container-view.component.html',
  styleUrls: ['./container-view.component.css', '../../common.css'],
})
export class ContainerViewComponent extends Hoverable {
  @Input() container!: InventoryContainer;
  @Input() colorized: boolean = false;
  @Input() deletable: boolean = true;

  @Output() containerChanged: EventEmitter<InventoryContainer> =
    new EventEmitter();
  @Output() itemMoved: EventEmitter<ItemMoveEvent> = new EventEmitter();
  @Output() containerDeleted: EventEmitter<InventoryContainer> =
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
  onWeightChange(weight: number) {
    this.containerChanged.emit({
      ...this.container,
      baseWeight: Math.round(weight * 1000),
    });
  }

  onPercentageChange(newValue: number) {
    this.containerChanged.emit({
      ...this.container,
      weightMultiplierPercent: newValue,
    });
  }

  drop(event: CdkDragDrop<Item>) {
    if (event.previousContainer.id === event.container.id) {
      const contents = [...this.container.contents];
      moveItemInArray(contents, event.previousIndex, event.currentIndex);
      this.containerChanged.emit({ ...this.container, contents });
    } else {
      const prevId = getContainerId(event.previousContainer.id);
      this.itemMoved.emit({
        sourceContainerId: prevId,
        destinationContainerId: this.container.id,
        itemId: event.item.data.id,
        index: event.currentIndex,
      });
    }
  }

  delete() {
    if (
      this.deletable &&
      (this.container.contents.length <= 0 ||
        confirm(`Delete container ${this.container.name}?`))
    ) {
      this.containerDeleted.emit(this.container);
    }
  }
}
