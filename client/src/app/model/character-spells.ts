import { DamageRoll } from './damage-roll';

export interface Spell {
  id: number;
  tier: number;
  school: string;
  name: string;
  hasSave: boolean;
  description: string;
  damage: DamageRoll[];
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
  spellSlotsAvailable: { [key: number]: number } = {};
  spells: { [key: number]: Spell[] } = [];
}
