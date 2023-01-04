import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DamageRoll } from 'src/app/model/damage-roll';
import { RollComponent } from 'src/app/model/diceroll';
import { randomId } from 'src/app/model/id-generator';
import { DamageRollChangedEvent } from './die-item/die-item.component';

@Component({
  selector: 'damage-dice',
  templateUrl: './damage-dice.component.html',
  styleUrls: ['./damage-dice.component.css', '../common.css'],
})
export class DamageDiceComponent {
  @Input() dice: DamageRoll[] = [];
  @Input() defaultType: string = 'slashing';
  @Output() dieAdded: EventEmitter<DamageRoll> = new EventEmitter();
  @Output() dieChanged: EventEmitter<DamageRoll> = new EventEmitter();
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
