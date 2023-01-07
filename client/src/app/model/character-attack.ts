import { DamageRoll } from './damage-roll';

export interface AttackEffect {
  save?: string;
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
  offhand: boolean;
  /**
   * Any additional effects.
   */
  effects: AttackEffect[];
}
