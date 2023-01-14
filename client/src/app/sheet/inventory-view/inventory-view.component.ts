import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { randomId } from 'src/app/model/id-generator';
import { containerWeight, InventoryContainer } from 'src/app/model/item';
import { ItemMoveEvent } from './container-view/container-view.component';

@Component({
  selector: 'inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.css', '../common.css'],
})
export class InventoryViewComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();

  get totalWeight() {
    return this.character.inventory.reduce(
      (weight, container) => weight + containerWeight(container),
      0
    );
  }

  get carryWeight(): number {
    const multiplier = this.character.race.powerfulBuild ? 10 : 5;
    return 1000 * multiplier * this.character.abilities.br.score;
  }

  get encumbered(): string | undefined {
    const weight = this.totalWeight;
    const maximum = this.carryWeight;
    if (weight <= maximum) {
      return undefined;
    }
    if (weight < 2 * maximum) {
      return 'Encumbered';
    }
    return 'Heavily encumbered';
  }

  onContainerChange(container: InventoryContainer) {
    this.character.inventory = this.character.inventory.map((old) =>
      old.id !== container.id ? old : container
    );
    this.characterChanged.emit();
  }

  onContainerDelete(container: InventoryContainer) {
    const existing = this.character.inventory.find(
      (cnt) => cnt.id === container.id
    );
    if (!existing) {
      throw new Error(`No inventory container with id ${container.id} found`);
    }
    if (this.character.inventory.length <= 1) {
      console.error("Can't delete the last container.");
      return;
    }
    const contents = existing.contents;
    this.character.inventory = this.character.inventory.filter(
      (cnt) => cnt.id !== container.id
    );

    if (contents && this.character) {
      this.character.inventory[0].contents = [
        ...this.character.inventory[0].contents,
        ...contents,
      ];
    }
  }

  addContainer() {
    const newContainer: InventoryContainer = {
      id: randomId(),
      name: 'New Container',
      description: '',
      baseWeight: 0,
      weightMultiplierPercent: 100,
      contents: [],
    };
    this.character.inventory.push(newContainer);
    this.characterChanged.emit();
  }

  onItemMove(event: ItemMoveEvent) {
    const source = this.character.inventory.find(
      (c) => c.id === event.sourceContainerId
    );

    const destination = this.character.inventory.find(
      (c) => c.id === event.destinationContainerId
    );
    if (!source) {
      throw new Error(
        `Source container with id ${event.sourceContainerId} not found for move.`
      );
    }
    if (!destination) {
      throw new Error(
        `Destination container wih id ${event.destinationContainerId} not found for move.`
      );
    }
    const item = source.contents.find((it) => it.id === event.itemId);
    if (!item) {
      throw new Error(
        `Item with id ${event.itemId} not found in source container for move.`
      );
    }
    source.contents = source.contents.filter((it) => it.id !== event.itemId);
    debugger;
    if (event.index !== undefined) {
      destination.contents = [...destination.contents]; //Change the array ref
      destination.contents.splice(event.index, 0, item);
    } else {
      destination.contents = [...destination.contents, item];
    }

    this.characterChanged.emit();
  }
}
