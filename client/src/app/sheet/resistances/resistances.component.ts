import { Component, EventEmitter, Input, Output } from '@angular/core';
import Resistance, { ResistanceType } from 'src/app/model/resistance';

export interface ResistanceModifyEvent {
  old: Resistance;
  new: Resistance;
}

@Component({
  selector: 'resistances',
  templateUrl: './resistances.component.html',
  styleUrls: ['./resistances.component.css', '../common.css'],
})
export class ResistancesComponent {
  inserting: boolean = false;
  @Input() racialResistances: Resistance[] = [];
  @Input() resistances: Resistance[] = [];
  @Output() resistanceInserted: EventEmitter<string> = new EventEmitter();
  @Output() resistanceDeleted: EventEmitter<Resistance> = new EventEmitter();
  @Output() resistanceModified: EventEmitter<ResistanceModifyEvent> =
    new EventEmitter();

  startInserting() {
    this.inserting = true;
  }

  endInserting(event: Event) {
    const element = event.target as HTMLInputElement;
    const insertedResistance = element.value.trim();
    if (insertedResistance.length > 0) {
      this.resistanceInserted.emit(element.value);
    }
    this.inserting = false;
  }
  onDelete(resistance: Resistance) {
    console.log('Delete', resistance);
    this.resistanceDeleted.emit(resistance);
  }
  onModifyType(type: ResistanceType, resistance: Resistance) {
    const event: ResistanceModifyEvent = {
      old: { ...resistance },
      new: { ...resistance, type },
    };
    this.resistanceModified.emit(event);
  }
}
