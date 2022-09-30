export interface Ability {
  identifier: string;
  score: number;
  get modifier(): number;
}
