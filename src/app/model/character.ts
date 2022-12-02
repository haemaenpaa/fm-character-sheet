import { Memoize } from 'typescript-memoize';
import { Ability } from './ability';
import { AoSelection } from './ao-selection';
import CharacterAbilities from './character-abilities';
import { SKILL_DEFAULT_ABILITIES } from './constants';
import { Race } from './race';
import { Skill } from './skill';

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
 */
export default class Character {
  name: string;
  race: Race;
  /**
   * Abilities; brawn, dexterity etc.
   */
  abilities: CharacterAbilities;
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
    this.abilities = new CharacterAbilities();

    this.abilities.br.score = br;
    this.abilities.dex.score = dex;
    this.abilities.vit.score = vit;
    this.abilities.int.score = int;
    this.abilities.cun.score = cun;
    this.abilities.res.score = res;
    this.abilities.pre.score = pre;
    this.abilities.man.score = man;
    this.abilities.com.score = com;
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
  /**
   * Gets a struct of ability modifiers.
   * @returns Snapshot of current ability modifiers.
   */
  getAbilityModifiers(): AbilityNumberStruct {
    const ret: AbilityNumberStruct = {
      br: this.abilities.br.modifier,
      dex: this.abilities.dex.modifier,
      vit: this.abilities.vit.modifier,
      int: this.abilities.int.modifier,
      cun: this.abilities.cun.modifier,
      res: this.abilities.res.modifier,
      pre: this.abilities.pre.modifier,
      man: this.abilities.man.modifier,
      com: this.abilities.com.modifier,
    };
    return ret;
  }

  get proficiency(): number {
    const level = this.totalLevel;
    if (level > 16) return 6;
    if (level > 12) return 5;
    if (level > 8) return 4;
    if (level > 4) return 3;
    return 2;
  }

  /**
   * Getter for the character's skills.
   * @returns Snapshot of the character's skills
   */
  @Memoize()
  getAllSkills(): Skill[] {
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
   *
   * @returns Snapshot of the character's current AO levels.
   */
  @Memoize()
  getAoLevels(): { [key: string]: number } {
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
