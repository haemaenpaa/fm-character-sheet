import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DamageRoll } from 'src/app/model/damage-roll';

export interface DamageRollChangedEvent {
  old: DamageRoll;
  new: DamageRoll | null;
}

@Component({
  selector: 'die-item',
  templateUrl: './die-item.component.html',
  styleUrls: ['./die-item.component.css', '../../common.css'],
})
export class DieItemComponent {
  @Input() roll!: DamageRoll;
  @Output() rollChanged: EventEmitter<DamageRollChangedEvent> =
    new EventEmitter();
  @Output() rolled: EventEmitter<DamageRoll> = new EventEmitter();
  hovered: boolean = false;
  selectOpen: boolean = false;
  rollable: boolean = true;

  delete() {
    this.rollChanged.emit({ old: this.roll, new: null });
  }

  onRollClicked() {
    if (!this.rollable) {
      return;
    }
    this.rolled.emit(this.roll);
  }
  onCountChanged(value: number) {
    const changed: DamageRoll = { ...this.roll };
    changed.roll.dice = value;
    this.rollChanged.emit({ old: this.roll, new: changed });
  }
  onDieChanged(event: Event) {
    const strValue = (event.target as HTMLInputElement).value;
    const value = Number.parseInt(strValue);
    if (isNaN(value)) {
      throw new Error(`Invalid option value ${strValue}`);
    }
    const changed: DamageRoll = { ...this.roll };
    changed.roll.sides = value;
    this.rollChanged.emit({ old: this.roll, new: changed });
  }
  onTypeChanged(type: string) {
    const changed: DamageRoll = { ...this.roll };
    changed.type = type;
    this.rollChanged.emit({ old: this.roll, new: changed });
  }
}
