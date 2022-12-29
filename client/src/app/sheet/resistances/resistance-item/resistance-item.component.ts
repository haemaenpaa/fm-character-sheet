import { Component, EventEmitter, Input, Output } from '@angular/core';
import Resistance, { ResistanceType } from 'src/app/model/resistance';

@Component({
  selector: 'resistance-item',
  templateUrl: './resistance-item.component.html',
  styleUrls: ['./resistance-item.component.css', '../../common.css'],
})
export class ResistanceItemComponent {
  hovered: boolean = false;
  @Input() resistance!: Resistance;
  @Input() racial: boolean = false;
  @Output() typeChange: EventEmitter<ResistanceType> = new EventEmitter();
  @Output() delete: EventEmitter<void> = new EventEmitter();

  toggleImmunity() {
    const newType =
      this.resistance.type == 'immunity' ? 'resistance' : 'immunity';
    this.typeChange.emit(newType);
  }
  emitDelete() {
    this.delete.emit(undefined);
  }

  onHover() {
    this.hovered = true;
  }
  onHoverEnd() {
    this.hovered = false;
  }
}
