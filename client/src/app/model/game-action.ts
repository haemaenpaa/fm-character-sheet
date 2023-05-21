import { NumberValueAccessor } from '@angular/forms';
import { Ability } from './ability';

export type Advantage = 'none' | 'disadvantage' | 'advantage';
export type ActionType =
  | 'ability-check'
  | 'ability-save'
  | 'skill-check'
  | 'spell-attack'
  | 'spell'
  | 'attack'
  | 'hit-die'
  | 'health-roll'
  | 'initiative';

/**
 * Parameters for an ability check.
 */
export interface CheckParams {
  characterName: string;
  ability: Ability;
  proficiency: number | null;
  advantage: Advantage;
}
/**
 * Parameters for a saving throw
 */
export interface SaveParams extends CheckParams {
  abilities: string[];
}
/**
 * Parameters for a skill check.
 */
export interface SkillParams {
  characterName: string;
  abilityIdentifier: string;
  abilityModifier: number;
  skillIdentifier: string;
  skillModifier: number;
  advantage: Advantage;
}
export interface SpellAttackParams {
  characterName: string;
  abilityIdentifier: string;
  spellAttackBonus: number;
  advantage: Advantage;
}

export interface SpellParams {
  characterId: number;
  spellTier: number;
  castingTier: number;
  spellId: number;
  soulCheck: boolean;
  advantage: {
    soulCheck: Advantage;
    attack: Advantage;
  };
}

export interface AttackParams {
  characterId: number;
  attackId: number;
  advantage: Advantage;
}
export interface HitDieParams {
  characterId: number;
  6: number;
  8: number;
  10: number;
  12: number;
}
export interface InitiativeParams {
  characterId: number;
  advantage: Advantage;
}

export interface GameAction {
  type: ActionType;
  params:
    | CheckParams
    | SaveParams
    | SkillParams
    | SpellAttackParams
    | SpellParams
    | AttackParams
    | HitDieParams
    | InitiativeParams;
}
