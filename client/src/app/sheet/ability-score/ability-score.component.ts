import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ability } from 'src/app/model/ability';
import { Advantage } from 'src/app/model/game-action';
import { AdvantageResolverService } from 'src/app/services/advantage-resolver.service';

/**
 * Event emitted when the ability score is edited by this component.
 */
export interface AbilityScoreEditedEvent {
  abilityIdentifier: string;
  abilityValue: number;
}

export interface AbillityRollEvent {
  advantage: Advantage;
  abilityIdentifier: string;
}

/**
 * Component to display a single ability score.
 *
 * The component emits a "roll" event when the ability modifier is clicked, and a "modified" event when the ability is modified.
 */
@Component({
  selector: 'ability-score',
  templateUrl: './ability-score.component.html',
  styleUrls: ['./ability-score.component.css'],
})
export class AbilityScoreComponent implements OnInit {
  @Input() ability!: Ability;
  /**
   * Modified event.
   * The event will be a AbilityScoreEditedEvent.
   */
  @Output() modified: EventEmitter<AbilityScoreEditedEvent> =
    new EventEmitter();
  /**
   * Roll event.
   * The emitted event will be a string corresponding to the ability's identifier.
   */
  @Output() roll: EventEmitter<AbillityRollEvent> = new EventEmitter();
  editing: boolean = false;
  constructor(private advantageResolver: AdvantageResolverService) {}

  ngOnInit(): void {}

  /**
   * Changes the component into an edit view.
   */
  startEditing() {
    this.editing = true;
  }
  /**
   * Handles a value changed event from the ability score edit.
   * @param newValue
   */
  valueChanged(newValue: number) {
    this.modified.emit({
      abilityValue: newValue,
      abilityIdentifier: this.ability.identifier,
    });
  }
  /**
   * Changes back to display mode after editing.
   */
  endEditing() {
    this.editing = false;
  }

  /**
   * Emits an ability check.
   */
  emitRoll(event: MouseEvent) {
    this.roll.emit({
      abilityIdentifier: this.ability.identifier,
      advantage: this.advantageResolver.resolveForEvent(event),
    });
  }
}
