import { ResistanceDto } from "fm-transfer-model";
import { CharacterDto } from "fm-transfer-model/src/model/character";
import { Character } from "../model/character";
import { Resistance } from "../model/resistance";
import { convertAbilitiesDto } from "./abilities-mapper";
import { convertAttackDto } from "./attack-mapper";
import {
  convertHitDiceDto,
  convertHitDiceRemainingDto,
} from "./hit-die-mapper";
import { convertRaceDto } from "./race-mapper";
import { convertSelectionDto } from "./selection-mapper";

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
    skills,
    hitPointTotal: dto.hitPointTotal || 0,
    hitPointMaximum: dto.hitPointMaximum || 0,
    tempHitPoints: dto.tempHitPoints || 0,
    ...convertAbilitiesDto(dto.abilities),
    savingThrows: dto.savingThrows?.join(",") || [],
    race,
    resistances,
    selections: dto.selections?.map((d) => convertSelectionDto(d)),
    attacks: dto.attacks?.map(convertAttackDto),
    hitDice: dto.hitDice ? convertHitDiceDto(dto.hitDice) : undefined,
    hitDiceRemaining: dto.hitDiceRemaining
      ? convertHitDiceRemainingDto(dto.hitDiceRemaining)
      : undefined,
  });
  return character;
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
