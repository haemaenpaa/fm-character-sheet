import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character from 'src/app/model/character';
import { randomId } from 'src/app/model/id-generator';
import { containerWeight, InventoryContainer } from 'src/app/model/item';

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
    if (weight < maximum) {
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

  addContainer() {
    const newContainer: InventoryContainer = {
      id: randomId(),
      name: 'New Container',
      description: '',
      baseWeight: 0,
      weightMultiplierPercent: 0,
      contents: [],
    };
    this.character.inventory.push(newContainer);
    this.characterChanged.emit();
  }
}
