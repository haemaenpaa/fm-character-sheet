/**
 * Model for a skill. Skill checks are composed of an ability and a bonus from skill rank.
 */
export interface Skill {
  identifier: string;
  name: string | null;
  rank: number;
  defaultAbilities: string[];
}
