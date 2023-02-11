import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { randomId } from 'src/app/model/id-generator';
import { containerWeight, InventoryContainer } from 'src/app/model/item';
import { InventoryService } from 'src/app/services/inventory.service';
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

  constructor(private inventoryService: InventoryService) {}
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
    const oldInventory = [...this.character.inventory];
    this.character.inventory = this.character.inventory.map((old) =>
      old.id !== container.id ? old : container
    );
    this.inventoryService.updateContainer(container, this.character.id!).then(
      (_) => {
        this.characterChanged.emit();
      },
      (err) => {
        console.error('Failed to update container', err);
        this.character.inventory = oldInventory;
      }
    );
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
    const oldInventory = [...this.character.inventory];
    const contents = existing.contents;
    this.character.inventory = this.character.inventory.filter(
      (cnt) => cnt.id !== container.id
    );

    if (contents.length) {
      this.character.inventory[0].contents = [
        ...this.character.inventory[0].contents,
        ...contents,
      ];
      this.inventoryService
        .bulkMoveItems(
          container.id,
          this.character.inventory[0].id,
          this.character.id!
        )
        .then(
          (_) => {
            this.deleteContainerInBackend(container, oldInventory);
          },
          (error) => {
            console.error('Failed to bulk move contents', error);
            this.character.inventory = oldInventory;
          }
        );
    } else {
      this.deleteContainerInBackend(container, oldInventory);
    }
  }

  private deleteContainerInBackend(
    container: InventoryContainer,
    oldInventory: InventoryContainer[]
  ) {
    this.inventoryService
      .deleteContainer(container.id, this.character.id!)
      .then(
        (_) => {
          this.characterChanged.emit();
        },
        (error) => {
          console.error('Failed to delete container.', error);
          this.character.inventory = oldInventory;
        }
      );
  }

  addContainer() {
    const oldInventory = [...this.character.inventory];
    const newContainer: InventoryContainer = {
      id: randomId(),
      name: 'New Container',
      description: '',
      baseWeight: 0,
      weightMultiplierPercent: 100,
      contents: [],
    };
    this.character.inventory.push(newContainer);
    this.inventoryService
      .createContainer(newContainer, this.character.id!)
      .then(
        (_) => {
          this.characterChanged.emit();
        },
        (err) => {
          console.error('Failed to create container.', err);
          this.character.inventory = oldInventory;
        }
      );
  }

  onItemMove(event: ItemMoveEvent) {
    const oldInventory = [...this.character.inventory];
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

    if (event.index !== undefined) {
      destination.contents = [...destination.contents]; //Change the array ref
      destination.contents.splice(event.index, 0, item);
    } else {
      destination.contents = [...destination.contents, item];
    }

    this.inventoryService
      .moveItem(event.itemId, event.destinationContainerId, this.character.id!)
      .then(
        (_) => {
          this.characterChanged.emit();
        },
        (error) => {
          console.error(error);
          this.character.inventory = oldInventory;
        }
      );
  }
}
