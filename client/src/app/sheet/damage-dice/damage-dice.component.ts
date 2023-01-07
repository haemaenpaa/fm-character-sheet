import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DamageRoll } from 'src/app/model/damage-roll';
import { RollComponent } from 'src/app/model/diceroll';
import { randomId } from 'src/app/model/id-generator';
import { DamageRollChangedEvent } from './die-item/die-item.component';

/**
 * Displays a list of damage rolls, associated with a single attack.
 */
@Component({
  selector: 'damage-dice',
  templateUrl: './damage-dice.component.html',
  styleUrls: ['./damage-dice.component.css', '../common.css'],
})
export class DamageDiceComponent {
  @Input() dice: DamageRoll[] = [];
  @Input() defaultType: string = 'slashing';
  @Input() hasBonuses: boolean = false;
  /**
   * Event emitted when a roll is added.
   */
  @Output() dieAdded: EventEmitter<DamageRoll> = new EventEmitter();
  /**
   * Event emitted when a roll is edited.
   */
  @Output() dieChanged: EventEmitter<DamageRoll> = new EventEmitter();
  /**
   * Event emitted when a die is deleted.
   */
  @Output() dieDeleted: EventEmitter<DamageRoll> = new EventEmitter();

  addRoll() {
    const roll = new RollComponent(6);
    const added: DamageRoll = {
      id: randomId(),
      roll: roll,
      type: this.defaultType,
    };

    this.dieAdded.emit(added);
  }

  onrollChanged(event: DamageRollChangedEvent) {
    if (event.new) {
      this.dieChanged.emit(event.new);
    } else {
      this.dieDeleted.emit(event.old);
    }
  }
}
