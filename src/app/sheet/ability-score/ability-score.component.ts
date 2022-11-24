import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ability } from 'src/app/model/ability';

/**
 * Event emitted when the ability score is edited by this component.
 */
export interface AbilityScoreEditedEvent {
  abilityIdentifier: string;
  abilityValue: number;
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
  @Output() modified = new EventEmitter();
  /**
   * Roll event.
   * The emitted event will be a string corresponding to the ability's identifier.
   */
  @Output() roll = new EventEmitter();
  editing: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  /**
   * Changes the component into an edit view.
   */
  startEditing() {
    this.editing = true;
  }
  /**
   * Handles a value changed event from the ability score edit.
   * @param event
   */
  valueChanged(event: Event) {
    var element = event.target as HTMLInputElement;
    var newValue = parseInt(element.value.trim());
    console.log(element.value);
    if (!isNaN(newValue)) {
      this.ability.score = newValue;
      this.modified.emit(newValue);
    }
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
  emitRoll() {
    console.log('roll ' + this.ability.identifier);
    this.roll.emit(this.ability);
  }
}
