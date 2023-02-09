import { AoSelection } from './ao-selection';
import { Race } from './race';
import { Skill } from './skill';
import Character from './character';
import Resistance, { ResistanceType } from './resistance';
import { CharacterSpells, Spell } from './character-spells';
import { randomId } from './id-generator';
import { DamageRoll } from './damage-roll';
import CharacterAttack, { AttackEffect } from './character-attack';
import CharacterHitDice from './character-hit-dice';
import { AO_HIT_DICE } from './constants';
import { InventoryContainer, Item } from './item';
import { CharacterBiography } from './character-bio';
import { CharacterResource } from './character-resource';

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
  speed: number = 6;

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
  armorValueOverride?: number;
  hitPointMaximum: number = 0;
  damageResistances: Resistance[] = [];
  statusResistances: Resistance[] = [];

  spellcastingAbility: string | null = null;
  spells: CharacterSpells = new CharacterSpells();
  attacks: CharacterAttack[] = [];
  inventory: InventoryContainer[] = [
    {
      id: randomId(),
      name: 'Equipment',
      description: 'Items carried on your person.',
      baseWeight: 0,
      weightMultiplierPercent: 100,
      contents: [],
    },
  ];

  biography: CharacterBiography = {
    id: randomId(),
    appearance: '',
    characterBiography: '',
    characterConnections: '',
    height: 0,
    weight: 0,
  };

  resources: CharacterResource[] = [];

  setName(name: string): CharacterBuilder {
    this.name = name;
    return this;
  }

  setRace(name: string, subrace?: string | null): CharacterBuilder {
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

  setRacePowerfulBuild(powerful: boolean): CharacterBuilder {
    this.race.powerfulBuild = powerful;
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

  setSpeed(speed: number): CharacterBuilder {
    this.speed = speed;
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

  setArmorValue(av?: number): CharacterBuilder {
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
    const sel: AoSelection = {
      id: randomId(),
      abilityOrigin: ao,
      level,
      name,
      description,
      isPrimary: false,
      takenAtLevel: 0,
      hilightColor: color,
    };
    return sel;
  }

  setSpellcastingAbility(ability: string): CharacterBuilder {
    this.spells.spellcastingAbility = ability;
    return this;
  }
  /**
   * Sets the soul fragments of a given potency.
   * @param inversePotency Inverse of the potency, e.g. 4 for 1/4
   * @param count amount of fragments.
   * @returns
   */
  setSoulFragments(inversePotency: number, count: number): CharacterBuilder {
    this.spells.soulFragments[inversePotency] = count;
    return this;
  }
  /**
   * Sets the souls of the given potency.
   *
   * @param potency Potency of the soul.
   * @param count Amount of souls.
   * @returns
   */
  setSouls(potency: number, count: number): CharacterBuilder {
    this.spells.souls[potency] = count;
    return this;
  }

  /**
   * Sets the spell slots, both total and available, of the tier.
   * @param tier Tier of spell slots.
   * @param count amount of spell slots to add.
   * @returns
   */
  setSpellSlots(tier: number, count: number): CharacterBuilder {
    this.spells.spellSlots[tier] = count;
    this.spells.spellSlotsAvailable[tier] = count;
    return this;
  }

  /**
   * Adds a spell to the character's spells.
   * @param spell Spell to add
   * @returns
   */
  addSpell(spell: Spell): CharacterBuilder {
    if (!(spell.tier in this.spells.spells)) {
      this.spells.spells[spell.tier] = [];
    }
    this.spells.spells[spell.tier].push(spell);
    return this;
  }

  /**
   * Adds an utility spell, i.e. one without a save or spell attack.
   * @param tier Spell tier
   * @param name Name of the spell
   * @param school Spell school
   * @param description Spell description
   * @param ritual Is this a ritual spell
   * @param soulMastery is this spell soul mastery for the character
   * @param concentration is this a concentration spell
   * @param castingTime Casting time of the spell
   * @param duration Duration of the spell
   * @param range Range and AoE of the spell
   * @param components Components of the spell
   * @param effect Effect of the spell
   * @returns
   */
  addUtilitySpell(
    tier: number,
    name: string,
    school: string,
    description: string,
    ritual: boolean = false,
    soulMastery: boolean = false,
    concentration: boolean = false,
    castingTime: string = 'Action',
    duration: string = '10 minutes',
    range: string = 'Touch',
    components: 'S, V',
    effect: 'Damage'
  ): CharacterBuilder {
    const spell: Spell = {
      id: randomId(),
      saveAbility: undefined,
      attack: false,
      tier,
      school,
      name,
      description,
      damage: [],
      upcastDamage: [],
      ritual,
      soulMastery,
      castingTime,
      concentration,
      duration,
      range,
      components,
      effect,
    };
    return this.addSpell(spell);
  }
  /**
   * Adds an offensive spell with a saving throw.
   * @param tier spell tier
   * @param name spell name
   * @param school spell school
   * @param description spell description
   * @param saveAbility ability used for saving throw.
   * @param damage Base damage of the spell.
   * @param upcastDamage additional damage per level of upcast.
   * @param soulMastery is this spell soul mastery for the character
   * @param concentration is this a concentration spell
   * @param castingTime Casting time of the spell
   * @param duration Duration of the spell
   * @param range Range and AoE of the spell
   * @param components Components of the spell
   * @param effect Effect of the spell
   * @returns
   */
  addSaveSpell(
    tier: number,
    name: string,
    school: string,
    description: string,
    saveAbility: string,
    damage: DamageRoll[],
    upcastDamage: DamageRoll[] = [],
    ritual: boolean = false,
    soulMastery: boolean = false,
    concentration: boolean = false,
    castingTime: string = 'Action',
    duration: string = 'Instant',
    range: string = 'Touch',
    components: 'S, V',
    effect: 'Damage'
  ): CharacterBuilder {
    const spell: Spell = {
      id: randomId(),
      attack: false,
      tier,
      school,
      name,
      saveAbility,
      description,
      damage,
      upcastDamage,
      ritual,
      soulMastery,
      castingTime,
      concentration,
      duration,
      range,
      components,
      effect,
    };
    return this.addSpell(spell);
  }

  /**
   * Adds an offensive spell with a spell attack roll.
   * @param tier spell tier
   * @param name spell name
   * @param school spell school
   * @param description spell description
   * @param damage base damage
   * @param upcastDamage additional damage per level of upcast.
   * @param soulMastery is this spell soul mastery for the character
   * @param concentration is this a concentration spell
   * @param castingTime Casting time of the spell
   * @param duration Duration of the spell
   * @param range Range and AoE of the spell
   * @param components Components of the spell
   * @param effect Effect of the spell
   * @returns
   */
  addAttackSpell(
    tier: number,
    name: string,
    school: string,
    description: string,
    damage: DamageRoll[],
    upcastDamage: DamageRoll[] = [],
    ritual: boolean = false,
    soulMastery: boolean = false,
    concentration: boolean = false,
    castingTime: string = 'Action',
    duration: string = 'Instant',
    range: string = 'Touch',
    components: 'S, V',
    effect: 'Damage'
  ): CharacterBuilder {
    const spell: Spell = {
      id: randomId(),
      attack: true,
      tier,
      school,
      name,
      saveAbility: undefined,
      description,
      damage,
      upcastDamage,
      ritual,
      castingTime,
      soulMastery,
      concentration,
      duration,
      range,
      components,
      effect,
    };
    return this.addSpell(spell);
  }

  addMeleeAttack(
    name: string,
    proficient: boolean,
    damage: DamageRoll[],
    ability: string = 'br',
    effects: AttackEffect[] = []
  ): CharacterBuilder {
    const attack: CharacterAttack = {
      id: randomId(),
      name,
      abilities: [ability],
      range: '1m',
      proficient,
      attackBonus: 0,
      damage,
      effects,
      offhand: false,
    };
    this.attacks.push(attack);
    return this;
  }
  addRangedAttack(
    name: string,
    range: string,
    proficient: boolean,
    damage: DamageRoll[],
    effects: AttackEffect[] = []
  ): CharacterBuilder {
    const attack: CharacterAttack = {
      id: randomId(),
      name,
      abilities: ['dex'],
      range,
      proficient,
      attackBonus: 0,
      damage,
      effects,
      offhand: false,
    };
    this.attacks.push(attack);
    return this;
  }

  /**
   * Adds an item to the equipment.
   * @returns
   */
  addItem(
    name: string,
    description: string,
    weight: number,
    quantity: number = 1,
    equipped: boolean = false,
    attuned: boolean = false
  ): CharacterBuilder {
    const item: Item = {
      id: randomId(),
      name,
      description,
      weight,
      quantity,
      equipped: equipped ? 'unequipped' : 'none',
      attunement: attuned ? 'unattuned' : 'none',
    };
    this.inventory[0].contents.push(item);
    return this;
  }

  /**
   * Sets the appearance in biography info
   * @param appearance The character's appearance.
   * @returns
   */
  setAppearance(appearance: string): CharacterBuilder {
    this.biography.appearance = appearance;
    return this;
  }
  /**
   * Sets the concept; a short description of the character.
   * @param concept a short, descriptive phrase
   * @returns
   */
  setConcept(concept: string | undefined): CharacterBuilder {
    this.biography.concept = concept;
    return this;
  }
  /**
   * Sets a description of the character's soul mark.
   * @param descr Description of the soul mark
   * @returns
   */
  setSoulMarkDescription(descr: string | undefined): CharacterBuilder {
    this.biography.soulMarkDescription = descr;
    return this;
  }
  /**
   * Sets the character's long form biography.
   * @param bio biography.
   */
  setBiography(bio: string): CharacterBuilder {
    this.biography.characterBiography = bio;
    return this;
  }
  /**
   * Sets a description of the character's connections.
   * @param connections
   */
  setCharacterConnections(connections: string): CharacterBuilder {
    this.biography.characterConnections = connections;
    return this;
  }

  /**
   * Sets the character's height.
   * @param height Height in cm
   */
  setHeight(height: number): CharacterBuilder {
    this.biography.height = Math.round(height);
    return this;
  }

  /**
   * Sets the character's weight.
   * @param weight Weight in kg
   */
  setWeight(weight: number): CharacterBuilder {
    this.biography.weight = weight;
    return this;
  }

  /**
   * Adds a character resource.
   * @param name Name of the resource
   * @param maximum  Maximum amount of the resource
   * @param shortRest Is this resource replenished on a short rest
   * @returns this
   */
  addResource(
    name: string,
    maximum: number,
    shortRest?: boolean
  ): CharacterBuilder {
    this.resources.push({
      id: randomId(),
      name,
      max: maximum,
      current: maximum,
      shortRest: !!shortRest,
    });
    return this;
  }

  /**
   * Builds the character.
   * @returns A character with the values in this builder.
   */
  build(): Character {
    var armorValue = 10 + Math.floor((this.dex - 10) / 2);
    if (this.armorValueOverride) {
      armorValue = this.armorValueOverride;
    }

    const hitDice: CharacterHitDice = {
      6: 0,
      8: 0,
      10: 0,
      12: 0,
    };
    this.selections.forEach((sel) => {
      if (sel.abilityOrigin in AO_HIT_DICE) {
        (hitDice as any)[AO_HIT_DICE[sel.abilityOrigin]] += 1;
      }
    });

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
      this.speed,
      this.selections,
      this.skills,
      this.savingThrows,
      armorValue,
      this.hitPointMaximum,
      this.damageResistances,
      this.statusResistances,
      this.spells,
      this.attacks,
      hitDice,
      this.inventory,
      this.biography,
      this.resources
    );
  }
}
