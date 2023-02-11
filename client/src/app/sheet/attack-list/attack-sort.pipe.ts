import { Pipe, PipeTransform } from '@angular/core';
import CharacterAttack from 'src/app/model/character-attack';
import { DamageRoll } from 'src/app/model/damage-roll';

@Pipe({
  name: 'attackSort',
})
export class AttackSortPipe implements PipeTransform {
  transform(value: CharacterAttack[]): CharacterAttack[] {
    return value.sort((a, b) => {
      if (a.proficient !== b.proficient) {
        return a.proficient ? -1 : 1;
      }
      if (a.attackBonus != b.attackBonus) {
        return b.attackBonus - a.attackBonus;
      }
      const aDamage = a.damage.reduce(totalDamageReducer, 0);
      const bDamage = b.damage.reduce(totalDamageReducer, 0);
      if (aDamage !== bDamage) {
        return bDamage - aDamage;
      }
      return a.name.localeCompare(b.name);
    });
  }
}

function totalDamageReducer(sum: number, current: DamageRoll): number {
  return sum + current.roll.dice * current.roll.sides;
}
