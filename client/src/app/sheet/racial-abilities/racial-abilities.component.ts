import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AbilityModifiedEvent {
  oldName: string | null;
  newName: string | null;
  description: string | null;
}

interface SkillDisplay {
  name: string;
  description: string;
}

@Component({
  selector: 'racial-abilities',
  templateUrl: './racial-abilities.component.html',
  styleUrls: ['./racial-abilities.component.css', '../common.css'],
})
export class RacialAbilitiesComponent {
  @Input() racialAbilities: { [key: string]: string } = {};
  @Input() editable: boolean = false;
  inserting: boolean = false;
  @Output() abilityChanged: EventEmitter<AbilityModifiedEvent> =
    new EventEmitter();

  onNameChanged(oldName: string, newName: string) {
    const description = this.racialAbilities[oldName];
    this.abilityChanged.emit({ oldName, newName, description });
  }
  onDescriptionChanged(name: string, description: string) {
    this.abilityChanged.emit({ oldName: name, newName: name, description });
  }
  onAbilityInserted(name: string) {
    if (name.length === 0) {
      return;
    }
    console.log(`Ability inserted: ${name}`);
    this.abilityChanged.emit({
      oldName: null,
      newName: name,
      description: '',
    });
  }
  onAbilityDeleted(oldName: string) {
    console.log(`Ability deleted: ${oldName}`);
    this.abilityChanged.emit({
      oldName: oldName,
      newName: null,
      description: null,
    });
  }
  onAbilityNameEdited($event: Event) {
    const element = $event.target as HTMLInputElement;
    console.log('Ability name inserted', element.value);
    this.onAbilityInserted(element.value);
    this.inserting = false;
  }

  get abilitiesList(): SkillDisplay[] {
    const ret: { name: string; description: string }[] = [];
    for (const name in this.racialAbilities) {
      ret.push({ name, description: this.racialAbilities[name] });
    }
    return ret;
  }
}
