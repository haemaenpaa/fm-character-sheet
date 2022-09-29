import { Ability } from './ability';
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
  constructor(
    br: number,
    dex: number,
    vit: number,
    int: number,
    cun: number,
    res: number,
    pre: number,
    man: number,
    com: number
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
      this.com
    );
  }
}
