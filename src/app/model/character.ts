import { Ability } from './ability';
import { AoSelection } from './ao-selection';
import { SKILL_DEFAULT_ABILITIES } from './constants';
import { Race } from './race';
import { Skill } from './skill';

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

export interface AbilityNumberStruct {
  br: number;
  dex: number;
  vit: number;
  int: number;
  cun: number;
  res: number;
  pre: number;
  man: number;
  com: number;
}

/**
 * A single character model, that encapsulates everything contained in a character sheet.
 *
 * The getters defined in this class will return a snapshot.
 */
export class Character {
  name: string;
  race: Race;
  /**
   * Abilities; brawn, dexterity etc.
   */
  abilities: AbilityNumberStruct;
  /**
   * The Ability Origin selections. A list of class abilities gained with levels.
   */
  selections: AoSelection[];
  defaultSkills: {
    anh: number;
    ath: number;
    dec: number;
    emp: number;
    inv: number;
    lea: number;
    med: number;
    occ: number;
    perc: number;
    pers: number;
    sub: number;
    ste: number;
    sur: number;
  };
  customSkills: Skill[];

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
    anh: number,
    ath: number,
    dec: number,
    emp: number,
    inv: number,
    lea: number,
    med: number,
    occ: number,
    perc: number,
    pers: number,
    sub: number,
    ste: number,
    sur: number,
    selections: AoSelection[],
    customSkills: Skill[]
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
    this.defaultSkills = {
      anh: anh,
      ath: ath,
      dec: dec,
      emp: emp,
      inv: inv,
      lea: lea,
      med: med,
      occ: occ,
      perc: perc,
      pers: pers,
      sub: sub,
      ste: ste,
      sur: sur,
    };
    this.selections = selections;
    this.customSkills = customSkills;
  }
  get abilityModifiers(): AbilityNumberStruct {
    const ret: AbilityNumberStruct = {
      br: this.brawn.modifier,
      dex: this.dexterity.modifier,
      vit: this.vitality.modifier,
      int: this.intelligence.modifier,
      cun: this.cunning.modifier,
      res: this.resolve.modifier,
      pre: this.presence.modifier,
      man: this.manipulation.modifier,
      com: this.composure.modifier,
    };
    return ret;
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

  get proficiency(): number {
    const level = this.totalLevel;
    if (level > 16) return 6;
    if (level > 12) return 5;
    if (level > 8) return 4;
    if (level > 4) return 3;
    return 2;
  }

  get skills(): Skill[] {
    const ret: Skill[] = [];
    for (const key in this.defaultSkills) {
      const current: Skill = {
        identifier: key,
        name: null,
        rank: (this.defaultSkills as any)[key],
        defaultAbilities: [...SKILL_DEFAULT_ABILITIES[key]],
      };
      ret.push(current);
    }
    this.customSkills.forEach((s) => ret.push({ ...s }));
    return ret;
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

  setSkillByIdentifier(identifier: string, rank: number) {
    if (identifier in this.defaultSkills) {
      (this.defaultSkills as any)[identifier] = rank;
      return;
    }
    this.customSkills
      .filter((s) => s.identifier == identifier)
      .forEach((s) => (s.rank = rank));
  }
}
