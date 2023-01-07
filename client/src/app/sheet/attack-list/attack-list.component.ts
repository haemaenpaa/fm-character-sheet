import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ability } from 'src/app/model/ability';
import Character, { AbilityNumberStruct } from 'src/app/model/character';
import CharacterAbilities from 'src/app/model/character-abilities';
import CharacterAttack, { copyAttack } from 'src/app/model/character-attack';
import { RollComponent } from 'src/app/model/diceroll';
import { randomId } from 'src/app/model/id-generator';

function abilityHash(character: Character): number {
  var ret = 0;
  const prime = 31;
  for (const abl in character.abilities) {
    const ability: Ability = (character.abilities as any)[abl];
    ret = ret * 31 + ability.score;
  }
  return ret;
}

function abilityModifiersEqual(a: AbilityNumberStruct, b: AbilityNumberStruct) {
  return (
    a.br === b.br &&
    a.dex === b.dex &&
    a.vit === b.vit &&
    a.int === b.int &&
    a.cun === b.cun &&
    a.res === b.res &&
    a.pre === b.pre &&
    a.man === b.man &&
    a.com === b.com
  );
}

@Component({
  selector: 'attack-list',
  templateUrl: './attack-list.component.html',
  styleUrls: ['./attack-list.component.css', '../common.css'],
})
export class AttackListComponent {
  @Input() character!: Character;
  @Input() colorized: boolean = false;
  @Output() characterChanged: EventEmitter<void> = new EventEmitter();

  abilityMemo: { hash: number; abilityModifiers?: AbilityNumberStruct } = {
    hash: 0,
  };

  get abilityModifiers(): AbilityNumberStruct {
    if (
      !this.abilityMemo.abilityModifiers ||
      abilityHash(this.character) != this.abilityMemo.hash ||
      !abilityModifiersEqual(
        this.abilityMemo.abilityModifiers,
        this.character.getAbilityModifiers()
      )
    ) {
      this.abilityMemo.abilityModifiers = this.character.getAbilityModifiers();
    }
    return this.abilityMemo.abilityModifiers!;
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

  onAttackChanged(modified: CharacterAttack) {
    this.character.attacks = this.character.attacks.map((atk) =>
      atk.id === modified.id ? modified : atk
    );
    this.characterChanged.emit();
  }
  onAttackCopied(original: CharacterAttack) {
    const copy = copyAttack(original);
    copy.id = randomId();
    this.character.attacks.push(copy);
    this.characterChanged.emit();
  }
  onAttackDeleted(deleted: CharacterAttack) {
    this.character.attacks = this.character.attacks.filter(
      (atk) => atk.id !== deleted.id
    );
    this.characterChanged.emit;
  }
}
