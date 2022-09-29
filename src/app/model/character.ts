import { Ability } from './ability';
import { AoSelection } from './ao-selection';
import { ABILITY_ABBREVIATIONS } from './constants';

class AbilityImpl implements Ability {
  name: string;
  shortName: string;
  score: number;

  constructor(name: string, score: number) {
    this.name = name;
    this.shortName = ABILITY_ABBREVIATIONS[name];
    this.score = score;
  }
  get modifier(): number {
    return Math.floor((this.score - 10) / 2);
  }
}

export class Character {
  private abilities: { [key: string]: number } = {};
  selections: AoSelection[];
  constructor(
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
    this.abilities = {
      Brawn: br,
      Dexterity: dex,
      Vitality: vit,
      Intelligence: int,
      Cunning: cun,
      Resolve: res,
      Presence: pre,
      Manipulation: man,
      Composure: com,
    };
    this.selections = selections;
  }
  get brawn(): Ability {
    const name = 'Brawn';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get dexterity(): Ability {
    const name = 'Dexterity';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get vitality(): Ability {
    const name = 'Vitality';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get intelligence(): Ability {
    const name = 'Intelligence';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get cunning(): Ability {
    const name = 'Cunning';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get resolve(): Ability {
    const name = 'Resolve';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get presence(): Ability {
    const name = 'Presence';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get manipulation(): Ability {
    const name = 'Manipulation';
    return new AbilityImpl(name, this.abilities[name]);
  }
  get composure(): Ability {
    const name = 'Composure';
    return new AbilityImpl(name, this.abilities[name]);
  }

  get totalLevel(): number {
    return this.selections.filter((s) => s.isPrimary).length;
  }

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

export class CharacterBuilder {
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
