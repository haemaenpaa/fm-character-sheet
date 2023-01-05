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

/**
 * A complete dice roll
 */
export class Roll {
  private _character: string | null = null; //The character that made the roll
  private _title: string | null = null; //The title of the roll, e.g. Dexterity check
  private _dice: RollComponent[] = []; //The dice being rolled
  private _modifiers: RollModifier[] = []; //The modifiers applied
  private _target: number | null = null; //Target to beat, if any.
  private _id?: number;
  private _name?: string;

  get character(): string | null {
    return this._character;
  }
  set character(value: string | null) {
    this._character = value;
  }

  get title(): string | null {
    return this._title;
  }
  set title(value: string | null) {
    this._title = value;
  }

  get target(): number | null {
    return this._target;
  }
  set target(value: number | null) {
    this._target = value;
  }

  get totalModifier() {
    var ret = 0;
    for (let m of this._modifiers) {
      ret += m.value;
    }
    return ret;
  }
  get id(): number | undefined {
    return this._id;
  }
  set id(value: number | undefined) {
    this._id = value;
  }

  get filteredModifiers(): RollModifier[] {
    return this._modifiers.filter((m) => m.value != 0);
  }

  addModifier(value: RollModifier) {
    this._modifiers.push(value);
  }

  addDie(value: RollComponent) {
    this._dice.push(value);
  }

  get dice(): RollComponent[] {
    return Array.from(this._dice);
  }

  get modifiers(): RollModifier[] {
    return Array.from(this._modifiers);
  }

  /**
   * Name of the specific thing being rolled for
   */
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
}
