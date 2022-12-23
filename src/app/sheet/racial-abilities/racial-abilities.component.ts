import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Memoize } from 'typescript-memoize';

export interface AbilityModifiedEvent {
  oldName: string;
  newName: string;
  description: string;
}

interface SkillDisplay {
  name: string;
  description: string;
}

@Component({
  selector: 'racial-abilities',
  templateUrl: './racial-abilities.component.html',
  styleUrls: ['./racial-abilities.component.css'],
})
export class RacialAbilitiesComponent {
  @Input() racialAbilities: { [key: string]: string } = {};
  @Output() abilityChanged: EventEmitter<AbilityModifiedEvent> =
    new EventEmitter();

  onNameChanged(oldName: string, newName: string) {
    const description = this.racialAbilities[oldName];
    this.abilityChanged.emit({ oldName, newName, description });
  }
  onDescriptionChanged(name: string, description: string) {
    this.abilityChanged.emit({ oldName: name, newName: name, description });
  }

  @Memoize()
  get abilitiesList(): SkillDisplay[] {
    const ret: { name: string; description: string }[] = [];
    for (const name in this.racialAbilities) {
      ret.push({ name, description: this.racialAbilities[name] });
    }
    return ret;
  }
}
