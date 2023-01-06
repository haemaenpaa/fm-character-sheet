import { RollComponent } from './diceroll';

export interface DamageRoll {
  id: number;
  roll: RollComponent;
  type: string;
}
