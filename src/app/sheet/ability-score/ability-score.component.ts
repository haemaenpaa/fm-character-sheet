import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ability } from 'src/app/model/ability';

export interface AbilityScoreEditedEvent {
  abilityIdentifier: string;
  abilityValue: number;
}

@Component({
  selector: 'ability-score',
  templateUrl: './ability-score.component.html',
  styleUrls: ['./ability-score.component.css'],
})
export class AbilityScoreComponent implements OnInit {
  @Input() ability!: Ability;
  @Output() modified = new EventEmitter();
  editing: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  startEditing() {
    this.editing = true;
  }
  valueChanged(event: Event) {
    var element = event.target as HTMLInputElement;
    var newValue = parseInt(element.value.trim());
    console.log(element.value);
    if (!isNaN(newValue)) {
      this.ability.score = newValue;
      this.modified.emit(newValue);
    }
  }
  endEditing() {
    this.editing = false;
  }
}
