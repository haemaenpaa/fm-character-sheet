import { Ability } from './ability';
import { AoSelection } from './ao-selection';
import { ABILITY_ABBREVIATIONS } from './constants';
import { Race } from './race';

class AbilityImpl implements Ability {
  identifier: string;
  score: number;

  constructor(name: string, score: number) {
    this.identifier = name;
    this.score = score;
  }
  get modifier(): number {
    return Math.floor((this.score - 10) / 2);
  }
}

/**
 * A single character model, that encapsulates everything contained in a character sheet.
 */
export class Character {
  name: string;
  race: Race;
  /**
   * Abilities; brawn, dexterity etc.
   */
  abilities: {
    br: number;
    dex: number;
    vit: number;
    int: number;
    cun: number;
    res: number;
    pre: number;
    man: number;
    com: number;
  };
  /**
   * The Ability Origin selections. A list of class abilities gained with levels.
   */
  selections: AoSelection[];

  constructor(
    name: string,
    race: Race,
    br: number,
    dex: number,
    vit: number,
    int: number,
    cun: number,
    res: number,
    pre: number,
    man: number,
    com: number,
    selections: AoSelection[]
  ) {
    this.name = name;
    this.race = race;
    this.abilities = {
      br: br,
      dex: dex,
      vit: vit,
      int: int,
      cun: cun,
      res: res,
      pre: pre,
      man: man,
      com: com,
    };
    this.selections = selections;
  }
  get brawn(): Ability {
    return new AbilityImpl('br', this.abilities.br);
  }
  setBrawn(value: number) {
    this.abilities.br = value;
  }
  get dexterity(): Ability {
    return new AbilityImpl('dex', this.abilities.dex);
  }
  setDexterity(value: number) {
    this.abilities.dex = value;
  }

  get vitality(): Ability {
    return new AbilityImpl('vit', this.abilities.vit);
  }
  setVitality(value: number) {
    this.abilities.vit = value;
  }

  get intelligence(): Ability {
    return new AbilityImpl('int', this.abilities.int);
  }
  setIntelligence(value: number) {
    this.abilities.int = value;
  }

  get cunning(): Ability {
    const name = 'cun';
    return new AbilityImpl(name, this.abilities[name]);
  }
  setCunning(value: number) {
    this.abilities.cun = value;
  }

  get resolve(): Ability {
    const name = 'res';
    return new AbilityImpl(name, this.abilities[name]);
  }
  setResolve(value: number) {
    this.abilities.res = value;
  }

  get presence(): Ability {
    const name = 'pre';
    return new AbilityImpl(name, this.abilities[name]);
  }
  setPresence(value: number) {
    this.abilities.pre = value;
  }

  get manipulation(): Ability {
    const name = 'man';
    return new AbilityImpl(name, this.abilities[name]);
  }
  setManipulation(value: number) {
    this.abilities.man = value;
  }

  get composure(): Ability {
    const name = 'com';
    return new AbilityImpl(name, this.abilities[name]);
  }
  setComposure(value: number) {
    this.abilities.com = value;
  }

  get totalLevel(): number {
    return this.selections.filter((s) => s.isPrimary).length;
  }

  /**
   * Counts the total amount of primary selections from each AO, to deduce the total level.
   */
  get aoLevels(): { [key: string]: number } {
    var ret: { [key: string]: number } = {};
    for (let selection of this.selections.filter((s) => s.isPrimary)) {
      const abilityOrigin = selection.abilityOrigin;
      if (!(abilityOrigin in ret)) {
        ret[abilityOrigin] = 1;
      } else {
        ret[abilityOrigin] += 1;
      }
    }
    return ret;
  }
}

/**
 * Builder for ease of constructing a character.
 */
export class CharacterBuilder {
  name: string = '';
  race: Race = {
    name: '',
    subrace: null,
    abilities: {},
  };
  br: number = 10;
  dex: number = 10;
  vit: number = 10;
  int: number = 10;
  cun: number = 10;
  res: number = 10;
  pre: number = 10;
  man: number = 10;
  com: number = 10;

  selections: AoSelection[] = [];

  setName(name: string): CharacterBuilder {
    this.name = name;
    return this;
  }

  setRace(name: string, subrace?: string): CharacterBuilder {
    this.race.name = name;
    if (subrace) {
      this.race.subrace = subrace;
    } else {
      this.race.subrace = null;
    }
    return this;
  }

  setBrawn(score: number): CharacterBuilder {
    this.br = Math.round(score);
    return this;
  }

  setDexterity(score: number): CharacterBuilder {
    this.dex = Math.round(score);
    return this;
  }

  setVitality(score: number): CharacterBuilder {
    this.vit = Math.round(score);
    return this;
  }

  setIntelligence(score: number): CharacterBuilder {
    this.int = Math.round(score);
    return this;
  }

  setCunning(score: number): CharacterBuilder {
    this.cun = Math.round(score);
    return this;
  }

  setResolve(score: number): CharacterBuilder {
    this.res = Math.round(score);
    return this;
  }

  setPresence(score: number): CharacterBuilder {
    this.pre = Math.round(score);
    return this;
  }

  setManipulation(score: number): CharacterBuilder {
    this.man = Math.round(score);
    return this;
  }

  setComposure(score: number): CharacterBuilder {
    this.com = Math.round(score);
    return this;
  }

  addSelection(
    ao: string,
    level: number,
    name: string,
    description: string,
    color?: string
  ) {
    const sel = this.buildSelection(ao, name, description, level, color);
    this.selections.push(sel);
    return this;
  }
  addSecondarySelection(
    ao: string,
    level: number,
    name: string,
    description: string,
    color?: string
  ) {
    const sel = this.buildSelection(ao, name, description, level, color);
    sel.isPrimary = false;
    this.selections.push(sel);
    return this;
  }

  private buildSelection(
    ao: string,
    name: string,
    description: string,
    level: number,
    color: string | undefined
  ) {
    const sel = new AoSelection();
    sel.abilityOrigin = ao;
    sel.name = name;
    sel.description = description;
    sel.level = level;
    if (color) {
      sel.hilightColor = color;
    }
    return sel;
  }

  build(): Character {
    return new Character(
      this.name,
      this.race,
      this.br,
      this.dex,
      this.vit,
      this.int,
      this.cun,
      this.res,
      this.pre,
      this.man,
      this.com,
      this.selections
    );
  }
}
