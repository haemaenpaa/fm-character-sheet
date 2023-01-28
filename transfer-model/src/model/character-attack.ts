import { DamageRoll as DamageRollDto } from "./damage-roll";

export interface AttackEffectDto {
  id?: number;
  save?: string;
  dv?: number;
  description?: string;
}

export default interface CharacterAttackDto {
  id?: number;
  /**
   * Name of the attack, e.g. Broadsword.
   */
  name?: string;
  /**
   * Range of the attack.
   */
  range?: string;
  /**
   * Abilities used for the attack. Usually 'br' or 'dex'
   */
  abilities?: string[];
  /**
   * Is the character proficient in this attack.
   */
  proficient?: boolean;
  /**
   * Other attack bonuses.
   */
  attackBonus?: number;
  /**
   * Damage for this attack.
   */
  damage?: DamageRollDto[];
  /**
   * Is this an offhand attack
   */
  offhand?: boolean;
  /**
   * Any additional effects.
   */
  effects?: AttackEffectDto[];
}
