import { Ability } from './ability';
import { ABILITY_ABBREVIATIONS } from './constants';

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
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get dexterity(): Ability {
    const name = 'Dexterity';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get vitality(): Ability {
    const name = 'Vitality';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get intelligence(): Ability {
    const name = 'Intelligence';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get cunning(): Ability {
    const name = 'Cunning';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get resolve(): Ability {
    const name = 'Resolve';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get presence(): Ability {
    const name = 'Presence';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get manipulation(): Ability {
    const name = 'Manipulation';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
  }
  get composure(): Ability {
    const name = 'Composure';
    return {
      name: name,
      shortName: ABILITY_ABBREVIATIONS[name],
      score: this.abilities[name],
    };
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
