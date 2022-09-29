export interface Ability {
  name: string;
  shortName: string;
  score: number;
  get modifier(): number;
}
