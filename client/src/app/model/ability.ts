/**
 * Describes a single ability score, such as dexterity.
 */
export interface Ability {
  identifier: string;
  score: number;
  get modifier(): number;
}
