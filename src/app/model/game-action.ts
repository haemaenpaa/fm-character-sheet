import { Ability } from './ability';

export type Advantage = 'none' | 'disadvantage' | 'advantage';
export type ActionType = 'ability-check' | 'ability-save' | 'skill-check';

/**
 * Parameters for a skill- or ability check.
 */
export interface CheckParams {
  characterName: string;
  ability: Ability;
  proficiency: number | null;
  advantage: Advantage;
}
export interface SkillParams {
  characterName: string;
  abilityIdentifier: string;
  abilityModifier: number;
  skillIdentifier: string;
  skillModifier: number;
  advantage: Advantage;
}

export interface GameAction {
  type: ActionType;
  params: CheckParams | SkillParams;
}
