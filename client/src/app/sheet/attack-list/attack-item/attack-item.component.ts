import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { AbilityNumberStruct } from 'src/app/model/character';
import CharacterAttack from 'src/app/model/character-attack';

@Component({
  selector: 'attack-item',
  templateUrl: './attack-item.component.html',
  styleUrls: ['./attack-item.component.css', '../../common.css'],
})
export class AttackItemComponent extends Hoverable {
  @Input() attack!: CharacterAttack;
  @Input() abilityModifiers!: AbilityNumberStruct;
  @Input() proficiency: number = 0;
  @Output() attackChanged: EventEmitter<CharacterAttack> = new EventEmitter();
  @Output() deleted: EventEmitter<CharacterAttack> = new EventEmitter();

  get totalBonus(): number {
    var ret = this.attack.attackBonus;
    if (this.attack.proficient) {
      ret += this.proficiency;
    }
    ret += this.abilityBonus;
    return ret;
  }

  get abilityBonus(): number {
    return this.attack.abilities.reduce(
      (bonus: number, abl: string) =>
        bonus + (this.abilityModifiers as any)[abl],
      0
    );
  }
}
