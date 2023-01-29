import { CharacterBiographyDto } from "fm-transfer-model";
import { CharacterBio } from "../model/character-bio";

export function convertBiographyDto(dto: CharacterBiographyDto): CharacterBio {
  return CharacterBio.build({
    concept: dto.concept,
    appearance: dto.appearance,
    soulMarkDescription: dto.soulMarkDescription,
    characterBiography: dto.characterBiography,
    characterConnections: dto.characterConnections,
    height: dto.height,
    weight: dto.weight,
  });
}

export function convertBiographyDbModel(
  model: CharacterBio
): CharacterBiographyDto {
  return {
    concept: model.getDataValue("concept"),
    appearance: model.getDataValue("appearance"),
    soulMarkDescription: model.getDataValue("soulMarkDescription"),
    characterBiography: model.getDataValue("characterBiography"),
    characterConnections: model.getDataValue("characterConnections"),
    height: model.getDataValue("height"),
    weight: model.getDataValue("weight"),
  };
}
