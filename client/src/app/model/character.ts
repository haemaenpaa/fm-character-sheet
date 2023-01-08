import { Ability } from './ability';
import { AoSelection } from './ao-selection';
import CharacterAbilities from './character-abilities';
import CharacterAttack from './character-attack';
import { CharacterSpells } from './character-spells';
import { SKILL_DEFAULT_ABILITIES } from './constants';
import { Race } from './race';
import Resistance from './resistance';
import { Skill } from './skill';
import CharacterHitDice from './character-hit-dice';

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
  id?: number;
  /**
   * Abilities; brawn, dexterity etc.
   */
  abilities: CharacterAbilities;
  /**
   * The default skills, always displayed on the character sheet.
   */
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

  /**
   * Current hit point total.
   */
  hitPointTotal: number;
  /**
   * Temporary hit points.
   */
  tempHitPoints: number;
  /**
   * Currently available hit dice.
   */
  hitDiceRemaining: CharacterHitDice;

  /**
   *
   * @param name Character name
   * @param race Character's race and the related abilities.
   * @param br Brawn
   * @param dex Dexterity
   * @param vit Vitality
   * @param int Intelligence
   * @param cun Cunning
   * @param res Resolve
   * @param pre Presence
   * @param man Manipulation
   * @param com Composure
   * @param anh Animal handling
   * @param ath Athletics
   * @param dec Deception
   * @param emp Empathy
   * @param inv Investigation
   * @param lea Leadership
   * @param med Medicine
   * @param occ Occult
   * @param perc Perception
   * @param pers Persuasion
   * @param sub Subterfuge
   * @param ste Stealth
   * @param sur Survival
   * @param selections The Ability Origin selections. A list of class abilities gained with levels.
   * @param customSkills Custom skills, such as academics and crafts
   * @param savingThrows Saving throw proficiencies
   * @param armorValue Armor value, the target number to hit the character with an attack.
   * @param hitPointMaximum The character's hit point maximum.
   * @param damageResistances Damage resistances and/or immunities
   * @param statusResistances Status resistances and/or immunities
   * @param spells Character's spells, spellcasting ability, souls and spell slots.
   * @param attacks
   * @param hitDice
   */
  constructor(
    public name: string,
    public race: Race,
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
    public selections: AoSelection[],
    public customSkills: Skill[],
    public savingThrows: string[],
    public armorValue: number,
    public hitPointMaximum: number,
    public damageResistances: Resistance[],
    public statusResistances: Resistance[],
    public spells: CharacterSpells,
    public attacks: CharacterAttack[],
    public hitDice: CharacterHitDice
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
    this.savingThrows = savingThrows;
    this.armorValue = armorValue;
    this.hitPointTotal = hitPointMaximum;
    this.tempHitPoints = 0;
    this.hitDiceRemaining = { ...hitDice };
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
   *
   * @returns The character's "Default" skills
   */
  getDefaultSkills(): Skill[] {
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
    return ret;
  }

  get totalLevel(): number {
    return this.selections.filter((s) => s.isPrimary).length;
  }

  /**
   * Spell saving throw, determined by spellcasting ability and proficiency.
   */
  get spellSave(): number {
    if (!this.spells.spellcastingAbility) {
      return 0;
    }
    const ability: Ability = (this.abilities as any)[
      this.spells.spellcastingAbility
    ];
    return 8 + this.proficiency + ability.modifier;
  }

  get spellAttack(): number {
    if (!this.spells.spellcastingAbility) {
      return 0;
    }
    const ability: Ability = (this.abilities as any)[
      this.spells.spellcastingAbility
    ];
    return this.proficiency + ability.modifier;
  }

  get castingAbility(): Ability | null {
    if (!this.spells.spellcastingAbility) {
      return null;
    }
    return (this.abilities as any)[this.spells.spellcastingAbility];
  }

  /**
   * Counts the total amount of primary selections from each AO, to deduce the total level.
   *
   * @returns Snapshot of the character's current AO levels.
   */
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

  addSavingThrow(save: string) {
    const present = this.savingThrows.find((s) => s === save);
    if (present != null) {
      return;
    }
    this.savingThrows = [...this.savingThrows, save];
  }

  removeSavingThrow(save: string) {
    const present = this.savingThrows.find((s) => s === save);
    if (present === null) {
      return;
    }
    this.savingThrows = this.savingThrows.filter((s) => s !== save);
  }
}
