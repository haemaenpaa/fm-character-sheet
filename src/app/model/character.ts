import { Ability } from './ability';
import { AoSelection } from './ao-selection';
import { ABILITY_ABBREVIATIONS, SKILL_DEFAULT_ABILITIES } from './constants';
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

  getSkills(): Skill[] {
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

  defaultSkills = {
    anh: 0,
    ath: 0,
    dec: 0,
    emp: 0,
    inv: 0,
    lea: 0,
    med: 0,
    occ: 0,
    perc: 0,
    pers: 0,
    sub: 0,
    ste: 0,
    sur: 0,
  };

  selections: AoSelection[] = [];
  skills: Skill[] = [];

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

  setAnimalHandling(rank: number): CharacterBuilder {
    this.defaultSkills.anh = rank;
    return this;
  }

  setAthletics(rank: number): CharacterBuilder {
    this.defaultSkills.ath = rank;
    return this;
  }
  setDeception(rank: number): CharacterBuilder {
    this.defaultSkills.dec = rank;
    return this;
  }
  setEmpathy(rank: number): CharacterBuilder {
    this.defaultSkills.emp = rank;
    return this;
  }
  setInvestigation(rank: number): CharacterBuilder {
    this.defaultSkills.inv = rank;
    return this;
  }
  setLeadership(rank: number): CharacterBuilder {
    this.defaultSkills.lea = rank;
    return this;
  }
  setMedicine(rank: number): CharacterBuilder {
    this.defaultSkills.med = rank;
    return this;
  }

  setOccult(rank: number): CharacterBuilder {
    this.defaultSkills.occ = rank;
    return this;
  }

  setPerception(rank: number): CharacterBuilder {
    this.defaultSkills.perc = rank;
    return this;
  }
  setPersuasion(rank: number): CharacterBuilder {
    this.defaultSkills.pers = rank;
    return this;
  }
  setSubterfuge(rank: number): CharacterBuilder {
    this.defaultSkills.sub = rank;
    return this;
  }
  setStealth(rank: number): CharacterBuilder {
    this.defaultSkills.ste = rank;
    return this;
  }
  setSurvival(rank: number): CharacterBuilder {
    this.defaultSkills.sur = rank;
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

  addCustomSkill(
    name: string,
    rank: number,
    defaultAbilities: string[] = []
  ): CharacterBuilder {
    const idx = this.skills.findIndex((s) => s.identifier == name);
    if (idx < 0) {
      const skill: Skill = {
        identifier: name,
        name: name,
        rank: rank,
        defaultAbilities: defaultAbilities,
      };
      this.skills.push(skill);
      return this;
    }
    this.skills[idx].name = name;
    this.skills[idx].rank = rank;
    this.skills[idx].name = name;
    this.skills[idx].defaultAbilities = defaultAbilities;
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

      this.defaultSkills.anh,
      this.defaultSkills.ath,
      this.defaultSkills.dec,
      this.defaultSkills.emp,
      this.defaultSkills.inv,
      this.defaultSkills.lea,
      this.defaultSkills.med,
      this.defaultSkills.occ,
      this.defaultSkills.perc,
      this.defaultSkills.pers,
      this.defaultSkills.sub,
      this.defaultSkills.ste,
      this.defaultSkills.sur,
      this.selections,
      this.skills
    );
  }
}
