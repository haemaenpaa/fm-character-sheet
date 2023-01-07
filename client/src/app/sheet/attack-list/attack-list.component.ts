import { Component, EventEmitter, Input, Output } from '@angular/core';
import Character, { AbilityNumberStruct } from 'src/app/model/character';
import CharacterAttack from 'src/app/model/character-attack';
import { RollComponent } from 'src/app/model/diceroll';
import { randomId } from 'src/app/model/id-generator';

@Component({
  selector: 'attack-list',
  templateUrl: './attack-list.component.html',
  styleUrls: ['./attack-list.component.css', '../common.css'],
})
export class AttackListComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();
  get abilityModifiers(): AbilityNumberStruct {
    return this.character.getAbilityModifiers();
  }
  addAttack() {
    const attack: CharacterAttack = {
      id: randomId(),
      name: 'New attack',
      range: '1m',
      abilities: ['br'],
      proficient: true,
      attackBonus: 0,
      damage: [
        { id: randomId(), type: 'slashing', roll: new RollComponent(6) },
      ],
      offhand: false,
      effects: [],
    };
    this.character.attacks.push(attack);
    console.log(this.character.attacks);
    this.characterChanged.emit();
  }
}
