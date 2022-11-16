export interface RollModifier {
  name: string;
  value: number;
}

export type KeepMode = 'HIGHEST' | 'LOWEST';

export class RollComponent {
  sides: number;
  dice: number = 1;
  keepMode: KeepMode = 'HIGHEST';
  keep: number;
  constructor(
    sides: number,
    dice: number = 0,
    keepMode: KeepMode,
    keep: number = dice
  ) {
    this.sides = sides;
    this.dice = dice;
    this.keep = keep;
    this.keepMode = keepMode;
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
}
