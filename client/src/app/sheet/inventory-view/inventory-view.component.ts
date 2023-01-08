import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { containerWeight, InventoryContainer, Item } from 'src/app/model/item';
import { ContainerViewComponent } from './container-view/container-view.component';

@Component({
  selector: 'inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.css'],
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
    if (weight < maximum) {
      return undefined;
    }
    if (weight < 2 * maximum) {
      return 'Encumbered';
    }
    return 'Heavily encumbered';
  }

  addItem(container: InventoryContainer, item: Item) {
    this.character.inventory = this.character.inventory.map((cnt) => {
      if (cnt.id !== container.id) {
        return cnt;
      }
      return { ...container, contents: [...container.contents, item] };
    });
    container.contents.push(item);
    this.characterChanged.emit();
  }
}
