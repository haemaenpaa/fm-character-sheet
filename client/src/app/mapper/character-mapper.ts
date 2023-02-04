import {
  AoSelectionDto,
  AttackEffectDto,
  CharacterAttackDto,
  CharacterResourceDto,
  CharacterSpellsDto,
  InventoryContainerDto,
  ItemDto,
  SkillDto,
  SpellDto,
} from 'fm-transfer-model';
import { CharacterDto } from 'fm-transfer-model/src/model/character';
import { AoSelection } from '../model/ao-selection';
import Character from '../model/character';
import CharacterAttack, { AttackEffect } from '../model/character-attack';
import { CharacterBuilder } from '../model/character-builder';
import { CharacterResource } from '../model/character-resource';
import { CharacterSpells, Spell } from '../model/character-spells';
import { randomId } from '../model/id-generator';
import {
  AttunementStatus,
  EquipStatus,
  InventoryContainer,
  Item,
} from '../model/item';
import { ResistanceType } from '../model/resistance';
import { Skill } from '../model/skill';
import { convertBiographyModel } from './biography-mapper';
import {
  convertDamageRollModel,
  convertDamageRollDto,
} from './damage-roll-mapper';
import { convertAoSelectionDto } from './selection-mapper';
import { convertSpellBookModel } from './spell-mapper';

export function convertCharacterDto(dto: CharacterDto): Character {
  const builder = new CharacterBuilder();
  if (dto.name) {
    builder.setName(dto.name);
  }
  convertRace(dto, builder);

  convertAbilities(dto, builder);
  convertSkills(dto, builder);
  convertSelections(dto, builder);
  builder.setArmorValue(dto.armorValue);
  if (dto.hitPointMaximum) {
    builder.setMaxHP(dto.hitPointMaximum);
  }
  convertResistances(dto, builder);

  convertSpells(dto, builder);
  convertAttacks(dto, builder);
  convertInventory(dto, builder);
  convertBio(dto, builder);
  convertResources(dto, builder);

  const ret: Character = builder.build();
  ret.id = dto.id;
  convertHp(ret, dto);
  convertHitDice(dto, ret);
  return ret;
}

export function convertCharacterModel(character: Character): CharacterDto {
  const ret = {
    id: character.id,
    name: character.name,
    abilities: {
      br: character.abilities.br.score,
      dex: character.abilities.dex.score,
      vit: character.abilities.vit.score,
      int: character.abilities.int.score,
      cun: character.abilities.cun.score,
      pre: character.abilities.pre.score,
      man: character.abilities.man.score,
      com: character.abilities.com.score,
    },
    defaultSkills: { ...character.defaultSkills },
    hitPointTotal: character.hitPointTotal,
    hitPointMaximum: character.hitPointMaximum,
    tempHitPoints: character.tempHitPoints,
    hitDice: { ...character.hitDice },
    hitDiceRemaining: { ...character.hitDiceRemaining },
    selections: character.selections.map(convertAoSelectionModel),
    customSkills: character.customSkills.map(convertSkillModel),
    savingThrows: [...character.savingThrows],
    armorValue: character.armorValue,
    damageResistances: character.damageResistances.map((res) => ({
      type: res.type,
      value: res.value,
    })),
    statusResistances: character.statusResistances.map((res) => ({
      type: res.type,
      value: res.value,
    })),
    spells: convertSpellBookModel(character.spells),
    attacks: character.attacks.map(convertAttackModel),
    inventory: character.inventory.map(convertInventoryContainerModel),
    biography: convertBiographyModel(character.biography),
    resources: character.resources.map(convertResourceModel),
  };

  return ret;
}

function convertResourceModel(model: CharacterResource): CharacterResourceDto {
  return {
    id: model.id,
    name: model.name,
    current: model.current,
    max: model.max,
    shortRest: model.shortRest,
  };
}

function convertInventoryContainerModel(
  model: InventoryContainer
): InventoryContainerDto {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    baseWeight: model.baseWeight,
    weightMultiplierPercent: model.weightMultiplierPercent,
    contents: model.contents.map(convertItemModel),
  };
}
function convertItemModel(model: Item): ItemDto {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    weight: model.weight,
    quantity: model.quantity,
    attunement: model.attunement,
    equipped: model.equipped,
  };
}

function convertAttackModel(model: CharacterAttack): CharacterAttackDto {
  return {
    id: model.id,
    name: model.name,
    range: model.range,
    abilities: model.abilities,
    proficient: model.proficient,
    attackBonus: model.attackBonus,
    damage: model.damage.map(convertDamageRollModel),
    offhand: model.offhand,
    effects: model.effects.map((e) => ({
      id: e.id,
      save: e.save,
      dv: e.dv,
      description: e.description,
    })),
  };
}
function convertSkillModel(skill: Skill): SkillDto {
  return {
    identifier: skill.identifier,
    name: skill.name,
    rank: skill.rank,
    defaultAbilities: [...skill.defaultAbilities],
  };
}
function convertAoSelectionModel(selection: AoSelection): AoSelectionDto {
  return {
    id: selection.id,
    abilityOrigin: selection.abilityOrigin,
    level: selection.level,
    name: selection.name,
    description: selection.description,
    hilightColor: selection.hilightColor,
    isPrimary: selection.isPrimary,
    takenAtLevel: selection.takenAtLevel,
  };
}

function convertHp(ret: Character, dto: CharacterDto) {
  ret.hitPointTotal = dto.hitPointTotal || 0;
  ret.tempHitPoints = dto.tempHitPoints || 0;
}

function convertResources(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.resources) {
    builder.resources = dto.resources.map((res) => ({
      id: res.id || randomId(),
      name: res.name || '',
      current: res.current || 0,
      max: res.max || 0,
      shortRest: !!res.shortRest,
    }));
  }
}

function convertBio(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.biography) {
    const biographyDto = dto.biography;
    builder.setConcept(biographyDto.concept);
    if (biographyDto.appearance) {
      builder.setAppearance(biographyDto.appearance);
    }
    builder.setSoulMarkDescription(biographyDto.soulMarkDescription);
    if (biographyDto.characterBiography) {
      builder.setBiography(biographyDto.characterBiography);
    }
    if (biographyDto.characterConnections) {
      builder.setBiography(biographyDto.characterConnections);
    }
    if (biographyDto.height) {
      builder.setHeight(biographyDto.height);
    }
    if (biographyDto.weight) {
      builder.setWeight(biographyDto.weight);
    }
    if (dto.id) {
      builder.biography.id = dto.id;
    }
  }
}

function convertInventory(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.inventory) {
    builder.inventory = dto.inventory.map(convertInventoryContainerDto);
  }
}

function convertSpells(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.spells) {
    builder.spells = convertSpellsDto(dto.spells);
  }
}

function convertHitDice(dto: CharacterDto, ret: Character) {
  if (dto.hitDice) {
    ret.hitDice[6] = dto.hitDice[6] || 0;
    ret.hitDice[8] = dto.hitDice[8] || 0;
    ret.hitDice[10] = dto.hitDice[10] || 0;
    ret.hitDice[12] = dto.hitDice[12] || 0;
  }
  if (dto.hitDiceRemaining) {
    ret.hitDiceRemaining[6] = dto.hitDiceRemaining[6] || 0;
    ret.hitDiceRemaining[8] = dto.hitDiceRemaining[8] || 0;
    ret.hitDiceRemaining[10] = dto.hitDiceRemaining[10] || 0;
    ret.hitDiceRemaining[12] = dto.hitDiceRemaining[12] || 0;
  }
}

function convertRace(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.race) {
    builder.setRace(dto.race.name!, dto.race.subrace);
    if (dto.race.abilities) {
      Object.keys(dto.race.abilities).forEach((name) =>
        builder.addRacialAbility(name, dto.race!.abilities[name])
      );
    }
    if (dto.race.damageResistances) {
      dto.race.damageResistances.forEach((res) =>
        builder.addRaceDmgResistance(res.value!, res.type as ResistanceType)
      );
    }
    if (dto.race.statusResistances) {
      dto.race.statusResistances.forEach((res) =>
        builder.addRaceStatusResistance(res.value!, res.type as ResistanceType)
      );
    }
    builder.setRacePowerfulBuild(!!dto.race.powerfulBuild);
  }
}

function convertAbilities(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.abilities) {
    builder.setBrawn(dto.abilities.br || 10);
    builder.setDexterity(dto.abilities.dex || 10);
    builder.setVitality(dto.abilities.vit || 10);
    builder.setIntelligence(dto.abilities.int || 10);
    builder.setCunning(dto.abilities.cun || 10);
    builder.setResolve(dto.abilities.res || 10);
    builder.setPresence(dto.abilities.pre || 10);
    builder.setManipulation(dto.abilities.man || 10);
    builder.setComposure(dto.abilities.com || 10);
  }
}

function convertSelections(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.selections) {
    builder.selections = dto.selections.map(convertAoSelectionDto);
  }
}

function convertSkills(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.defaultSkills) {
    builder.defaultSkills = Object.assign(
      builder.defaultSkills,
      dto.defaultSkills
    );
  }
  if (dto.customSkills) {
    dto.customSkills.forEach((skill) => {
      builder.addCustomSkill(skill.name!, skill.rank!, skill.defaultAbilities);
    });
  }

  if (dto.savingThrows) {
    dto.savingThrows.forEach((s) => builder.addSavingThrow(s));
  }
}

function convertResistances(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.damageResistances) {
    dto.damageResistances.forEach((res) =>
      builder.addDmgResistance(res.value!, res.type! as ResistanceType)
    );
  }
  if (dto.statusResistances) {
    dto.statusResistances.forEach((res) =>
      builder.addStatusResistance(res.value!, res.type! as ResistanceType)
    );
  }
}

function convertAttacks(dto: CharacterDto, builder: CharacterBuilder) {
  if (dto.attacks) {
    builder.attacks = dto.attacks.map((atk) => {
      const attack: CharacterAttack = {
        id: atk.id!,
        name: atk.name!,
        range: atk.range || '',
        abilities: atk.abilities || [],
        proficient: !!atk.proficient,
        attackBonus: atk.attackBonus || 0,
        damage: atk.damage?.map(convertDamageRollDto) || [],
        offhand: !!atk.offhand,
        effects: atk.effects?.map(convertAttackEffectDto) || [],
      };
      return attack;
    });
  }
}

function convertSpellsDto(dto: CharacterSpellsDto): CharacterSpells {
  const spells = new CharacterSpells();
  if (dto.spellcastingAbility) {
    spells.spellcastingAbility = dto.spellcastingAbility;
  }
  if (dto.soulFragments) {
    spells.soulFragments = dto.soulFragments;
  }
  if (dto.souls) {
    spells.souls = dto.souls;
  }
  if (dto.spellSlots) {
    spells.spellSlots = dto.spellSlots;
  }
  if (dto.spellSlotsAvailable) {
    spells.spellSlotsAvailable = dto.spellSlotsAvailable;
  }
  if (dto.specialSlots) {
    spells.specialSlots = dto.specialSlots;
  }
  if (dto.specialSlotsAvailable) {
    spells.specialSlotsAvailable = dto.specialSlotsAvailable;
  }
  if (dto.spells) {
    for (const tier in dto.spells) {
      spells.spells[tier] = dto.spells[tier].map(convertSpellDto);
    }
  }
  return spells;
}

function convertSpellDto(dto: SpellDto): Spell {
  return {
    id: dto.id!,
    tier: dto.tier || 0,
    school: dto.school || '',
    name: dto.name || '',
    saveAbility: dto.saveAbility,
    description: dto.description || '',
    damage: dto.damage?.map(convertDamageRollDto) || [],
    upcastDamage: dto.upcastDamage?.map(convertDamageRollDto) || [],
    ritual: !!dto.ritual,
    soulMastery: !!dto.soulMastery,
    concentration: !!dto.concentration,
    attack: !!dto.attack,
    castingTime: dto.castingTime || '',
    duration: dto.duration || '',
    range: dto.range || '',
    components: dto.components || '',
    effect: dto.effect || '',
  };
}

function convertAttackEffectDto(dto: AttackEffectDto): AttackEffect {
  return {
    id: dto.id || randomId(),
    dv: dto.dv,
    save: dto.save,
    description: dto.description || '',
  };
}
function convertInventoryContainerDto(
  dto: InventoryContainerDto
): InventoryContainer {
  return {
    id: dto.id || randomId(),
    name: dto.name || '',
    description: dto.description || '',
    baseWeight: dto.baseWeight || 0,
    weightMultiplierPercent: dto.weightMultiplierPercent || 100,
    contents: dto.contents?.map(convertItemDto) || [],
  };
}
function convertItemDto(dto: ItemDto): Item {
  return {
    id: dto.id || randomId(),
    name: dto.name || '',
    description: dto.description || '',
    weight: dto.weight || 0,
    quantity: dto.quantity || 1,
    attunement: (dto.attunement as AttunementStatus) || 'none',
    equipped: (dto.equipped as EquipStatus) || 'unequipped',
  };
}
