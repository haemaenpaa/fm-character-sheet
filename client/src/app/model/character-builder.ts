import { AoSelection } from './ao-selection';
import { Race } from './race';
import { Skill } from './skill';
import Character from './character';
import Resistance, { ResistanceType } from './resistance';

/**
 * Builder for ease of constructing a character.
 */

export class CharacterBuilder {
  name: string = '';
  race: Race = {
    name: '',
    subrace: null,
    abilities: {},
    damageResistances: [],
    statusResistances: [],
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
  savingThrows: string[] = [];
  armorValueOverride: number | null = null;
  hitPointMaximum: number = 0;
  damageResistances: Resistance[] = [];
  statusResistances: Resistance[] = [];

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

  addRaceDmgResistance(
    dmgType: string,
    type: ResistanceType = 'resistance'
  ): CharacterBuilder {
    this.race.damageResistances.push({
      type,
      value: dmgType,
    });
    return this;
  }

  addDmgResistance(
    dmgType: string,
    type: ResistanceType = 'resistance'
  ): CharacterBuilder {
    this.damageResistances.push({
      type,
      value: dmgType,
    });
    return this;
  }

  addRaceStatusResistance(
    status: string,
    type: ResistanceType = 'resistance'
  ): CharacterBuilder {
    this.race.statusResistances.push({
      type: type,
      value: status,
    });
    return this;
  }

  addStatusResistance(
    status: string,
    type: ResistanceType = 'resistance'
  ): CharacterBuilder {
    this.statusResistances.push({
      type: type,
      value: status,
    });
    return this;
  }

  addRacialAbility(name: string, description: string): CharacterBuilder {
    this.race.abilities[name] = description;
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

  addSavingThrow(save: string): CharacterBuilder {
    if (!(save in this.savingThrows)) {
      this.savingThrows.push(save);
    }
    return this;
  }
  removeSavingThrow(save: string): CharacterBuilder {
    this.savingThrows = this.savingThrows.filter((s) => s !== save);
    return this;
  }

  setMaxHP(hp: number): CharacterBuilder {
    this.hitPointMaximum = hp;
    return this;
  }

  setArmorValue(av: number | null): CharacterBuilder {
    this.armorValueOverride = av;
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
    var armorValue = 10 + Math.floor((this.dex - 10) / 2);
    if (this.armorValueOverride) {
      armorValue = this.armorValueOverride;
    }
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
      this.skills,
      this.savingThrows,
      armorValue,
      this.hitPointMaximum,
      this.damageResistances,
      this.statusResistances
    );
  }
}