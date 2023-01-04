import { DamageRoll } from './damage-roll';

export interface Spell {
  /**
   * Identifier.
   */
  id: number;
  /**
   * Spell tier; the minimum tier of spell slot needed to cast.
   */
  tier: number;
  /**
   * Spell school, e.g. transmutation
   */
  school: string;
  /**
   * Name of the spell
   */
  name: string;
  /**
   * Ability used for the saving throw.
   */
  saveAbility: string | null;
  /**
   * Description of the spell.
   */
  description: string;
  /**
   * Damage rolls, if applicable.
   */
  damage: DamageRoll[];
  /**
   * Increase in damage on upcast.
   */
  upcastDamage: DamageRoll[];
  /**
   * Is this spell a ritual
   */
  ritual: boolean;
  /**
   * Is this spell a soul mastery spell
   */
  soulMastery: boolean;
  /**
   * Casting time of this spell
   */
  castingTime: string;
}

export class CharacterSpells {
  /**
   * Spellcasting ability
   */
  spellcastingAbility: string | null = null;
  /**
   * Soul fragments. Indexed by the denominator, e.g. index 4 maps to 1/4.
   */
  soulFragments: { [key: number]: number } = {};
  /**
   * Souls in the soul mark.
   */
  souls: { [key: number]: number } = {};
  /**
   * Spell slots.
   */
  spellSlots: { [key: number]: number } = {};
  /**
   * Available spell slots
   */
  spellSlotsAvailable: { [key: number]: number } = {};
  /**
   * Special slots, e.g. for Smite
   */
  specialSlots: { [key: number]: number } = {};
  /**
   * Available speecial slots, e.g. for Smite
   */
  specialSlotsAvailable: { [key: number]: number } = {};
  /**
   * Spells
   */
  spells: { [key: number]: Spell[] } = {};
}