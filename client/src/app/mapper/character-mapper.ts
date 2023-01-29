import {
  AttackEffectDto,
  CharacterSpellsDto,
  DamageRollDto,
  InventoryContainerDto,
  ItemDto,
  SpellDto,
} from 'fm-transfer-model';
import { CharacterDto } from 'fm-transfer-model/src/model/character';
import { AoSelection } from '../model/ao-selection';
import Character from '../model/character';
import CharacterAttack, { AttackEffect } from '../model/character-attack';
import { CharacterBuilder } from '../model/character-builder';
import { CharacterSpells, Spell } from '../model/character-spells';
import { DamageRoll } from '../model/damage-roll';
import { RollComponent } from '../model/diceroll';
import { randomId } from '../model/id-generator';
import {
  AttunementStatus,
  EquipStatus,
  InventoryContainer,
  Item,
} from '../model/item';
import { ResistanceType } from '../model/resistance';

export function convertCharacterDto(dto: CharacterDto): Character {
  const builder = new CharacterBuilder();
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
    builder.selections = dto.selections.map((sel) => {
      const selection = new AoSelection();
      return Object.assign(selection, sel);
    });
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

function convertDamageRollDto(dto: DamageRollDto): DamageRoll {
  const roll: DamageRoll = {
    id: dto.id || randomId(),
    roll: new RollComponent(dto.dieSize!, dto.dieCount!),
    type: dto.type!,
  };
  return roll;
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
