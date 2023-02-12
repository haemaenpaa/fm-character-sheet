/**
 * A constant modifier to a dice roll.
 */
export interface RollModifier {
  name: string;
  value: number;
}

/**
 * The keep mode for a dice roll.
 *
 * When a roll calls to discard one or more dice rolled, such as with advantage, this determines which dice are kept.
 */
export type KeepMode = 'HIGHEST' | 'LOWEST';

/**
 * A dice roll component.
 *
 * This model contains the size of the dice and the amount of dice rolled, as well as the amount of dice kept.
 */
export class RollComponent {
  sides: number;
  dice: number = 1;
  keepMode: KeepMode = 'HIGHEST';
  keep: number;
  name?: string;
  bonus?: number;
  constructor(
    sides: number,
    dice: number = 1,
    keepMode: KeepMode = 'HIGHEST',
    keep: number = dice,
    name?: string
  ) {
    this.sides = sides;
    this.dice = dice;
    this.keep = keep;
    this.keepMode = keepMode;
    this.name = name;
  }
}

export type Roll = MultiRoll | SimpleRoll;

/**
 * A complete dice roll
 */
export class SimpleRoll {
  character: string | null = null; //The character that made the roll
  title: string | null = null; //The title of the roll, e.g. Dexterity check
  dice: RollComponent[] = []; //The dice being rolled
  modifiers: RollModifier[] = []; //The modifiers applied
  target: number | null = null; //Target to beat, if any.
  id?: number;
  name?: string;
  description?: string;

  get totalModifier() {
    var ret = 0;
    for (let m of this.modifiers) {
      ret += m.value;
    }
    return ret;
  }

  get filteredModifiers(): RollModifier[] {
    return this.modifiers.filter((m) => m.value != 0);
  }

  addModifier(value: RollModifier) {
    this.modifiers.push(value);
  }

  addDie(value: RollComponent) {
    this.dice.push(value);
  }
}

/**
 * A collection of multiple rolls, such as a cast spell.
 */
export interface MultiRoll {
  title: string;
  rolls: SimpleRoll[];
}
