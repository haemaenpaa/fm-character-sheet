/**
 * Model for a skill. Skill checks are composed of an ability and a bonus from skill rank.
 */
export interface Skill {
  identifier: string;
  name?: string;
  rank: number;
  defaultAbilities: string[];
}
