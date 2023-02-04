import { DamageRoll } from './damage-roll';
import { randomId } from './id-generator';

export interface AttackEffect {
  id: number;
  save?: string;
  dv?: number;
  description: string;
}

export default interface CharacterAttack {
  id: number;
  /**
   * Name of the attack, e.g. Broadsword.
   */
  name: string;
  /**
   * Range of the attack.
   */
  range: string;
  /**
   * Abilities used for the attack. Usually 'br' or 'dex'
   */
  abilities: string[];
  /**
   * Is the character proficient in this attack.
   */
  proficient: boolean;
  /**
   * Other attack bonuses.
   */
  attackBonus: number;
  /**
   * Damage for this attack.
   */
  damage: DamageRoll[];
  /**
   * Is this an offhand attack
   */
  offhand: boolean;
  /**
   * Any additional effects.
   */
  effects: AttackEffect[];
}

export function copyAttack(original: CharacterAttack): CharacterAttack {
  const ret = { ...original };
  ret.abilities = [...original.abilities];
  ret.damage = original.damage.map((d) => ({
    ...d,
    roll: { ...d.roll },
    id: randomId(),
  }));
  ret.effects = original.effects.map((e) => ({ ...e, id: randomId() }));
  return ret;
}
