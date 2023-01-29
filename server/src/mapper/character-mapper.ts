import { CharacterAbilitiesDto, ResistanceDto } from "fm-transfer-model";
import { CharacterDto } from "fm-transfer-model/src/model/character";
import { Model } from "sequelize";
import ModelManager from "sequelize/types/model-manager";
import { Character } from "../model/character";
import { Resistance } from "../model/resistance";
import { convertAbilitiesDto } from "./abilities-mapper";
import { convertAttackDbModel, convertAttackDto } from "./attack-mapper";
import {
  convertBiographyDbModel,
  convertBiographyDto,
} from "./biography-mapper";
import {
  convertHitDiceDbModel,
  convertHitDiceDto,
  convertHitDiceRemainingDto,
} from "./hit-die-mapper";
import {
  convertInventoryContainerDbModel,
  convertInventoryContainerDto,
} from "./inventory-mapper";
import { convertRaceDbModel, convertRaceDto } from "./race-mapper";
import { convertResourceDbModel, convertResourceDto } from "./resource-mapper";
import {
  convertSelectionDbModel,
  convertSelectionDto,
} from "./selection-mapper";
import { convertSkillDbModel, convertSkillDto } from "./skill-mapper";
import { convertSpellbookDbModel, convertSpellbookDto } from "./spell-mapper";

export function convertCharacterDto(dto: CharacterDto): Character {
  const ret = Character.build();
  var skills = {
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
  if (dto.defaultSkills) {
    skills = { ...dto.defaultSkills };
  }
  const resistances = (dto.damageResistances || [])
    .map((d) => convertResistanceDto(d, "damage"))
    .concat(
      dto.statusResistances.map((d) => convertResistanceDto(d, "status"))
    );

  const race = convertRaceDto(dto.race);
  const character = Character.build({
    id: dto.id,
    name: dto.name || "",
    ...skills,
    customSkills: dto.customSkills?.map(convertSkillDto),
    hitPointTotal: dto.hitPointTotal || 0,
    hitPointMaximum: dto.hitPointMaximum || 0,
    tempHitPoints: dto.tempHitPoints || 0,
    ...convertAbilitiesDto(dto.abilities),
    savingThrows: dto.savingThrows?.join(",") || null,
    race,
    resistances,
    selections: dto.selections?.map((d) => convertSelectionDto(d)),
    attacks: dto.attacks?.map(convertAttackDto),
    hitDice: dto.hitDice ? convertHitDiceDto(dto.hitDice) : undefined,
    hitDiceRemaining: dto.hitDiceRemaining
      ? convertHitDiceRemainingDto(dto.hitDiceRemaining)
      : undefined,
    inventory: dto.inventory?.map(convertInventoryContainerDto),
    biography: dto.biography ? convertBiographyDto(dto.biography) : undefined,
    resources: dto.resources?.map(convertResourceDto),
  });
  return character;
}

export function convertCharacterDbModel(model: Character): CharacterDto {
  const defaultSkills = {
    anh: model.getDataValue("anh"),
    ath: model.getDataValue("ath"),
    dec: model.getDataValue("dec"),
    emp: model.getDataValue("emp"),
    inv: model.getDataValue("inv"),
    lea: model.getDataValue("lea"),
    med: model.getDataValue("med"),
    occ: model.getDataValue("occ"),
    perc: model.getDataValue("perc"),
    pers: model.getDataValue("pers"),
    sub: model.getDataValue("sub"),
    ste: model.getDataValue("ste"),
    sur: model.getDataValue("sur"),
  };

  const customSkills = model
    .getDataValue("customSkills")
    ?.map(convertSkillDbModel);
  console.log("Brawn", model.getDataValue("br"));
  const abilities: CharacterAbilitiesDto = {
    br: model.getDataValue("br"),
    dex: model.getDataValue("dex"),
    vit: model.getDataValue("vit"),
    int: model.getDataValue("int"),
    cun: model.getDataValue("cun"),
    res: model.getDataValue("res"),
    pre: model.getDataValue("pre"),
    man: model.getDataValue("man"),
    com: model.getDataValue("com"),
  };

  return {
    id: model.getDataValue("id"),
    name: model.getDataValue("name"),
    defaultSkills,
    customSkills,
    abilities,
    hitPointTotal: model.getDataValue("hitPointTotal"),
    hitPointMaximum: model.getDataValue("hitPointMaximum"),
    tempHitPoints: model.getDataValue("tempHitPoints"),
    race: convertRaceDbModel(model.getDataValue("race")),
    damageResistances: model
      .getDataValue("resistances")
      ?.filter((r) => r.category == "damage")
      .map(convertResistanceDbModel),
    statusResistances: model
      .getDataValue("resistances")
      ?.filter((r) => r.category == "status")
      .map(convertResistanceDbModel),
    selections: model.getDataValue("selections")?.map(convertSelectionDbModel),
    spells: convertSpellbookDbModel(model.getDataValue("spells")),
    attacks: model.getDataValue("attacks")?.map(convertAttackDbModel),
    hitDice: convertHitDiceDbModel(model.getDataValue("hitDice")),
    hitDiceRemaining: convertHitDiceDbModel(
      model.getDataValue("hitDiceRemaining")
    ),
    inventory: model
      .getDataValue("inventory")
      ?.map(convertInventoryContainerDbModel),
    biography: convertBiographyDbModel(model.getDataValue("biography")),
    resources: model.getDataValue("resources")?.map(convertResourceDbModel),
  };
}

function convertResistanceDto(
  dto: ResistanceDto,
  category: string
): Resistance {
  return Resistance.build({
    type: dto.type || "resistance",
    value: dto.value || "UNKNOWN",
    category,
  });
}
function convertResistanceDbModel(model: Resistance): ResistanceDto {
  return {
    type: model.getDataValue("type"),
    value: model.getDataValue("value"),
  };
}
