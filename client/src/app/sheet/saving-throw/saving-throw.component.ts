import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Advantage } from 'src/app/model/game-action';
import { AdvantageResolverService } from 'src/app/services/advantage-resolver.service';

export interface SavingThrowEvent {
  abilities: string[];
  advantage: Advantage;
}

@Component({
  selector: 'saving-throw',
  templateUrl: './saving-throw.component.html',
  styleUrls: ['./saving-throw.component.css'],
})
export class SavingThrowComponent {
  @Input() hasSave: boolean = false;
  @Input() ability: string[] = ['br'];
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @Output() roll: EventEmitter<SavingThrowEvent> = new EventEmitter();

  constructor(private advantageResolver: AdvantageResolverService) {}

  emitRoll($event: MouseEvent) {
    this.roll.emit({
      abilities: this.ability,
      advantage: this.advantageResolver.resolveForEvent($event),
    });
  }
}
