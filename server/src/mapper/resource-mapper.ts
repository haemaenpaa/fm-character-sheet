import { CharacterResourceDto } from "fm-transfer-model";
import { CharacterResource } from "../model/resources";

export function convertResourceDto(
  dto: CharacterResourceDto
): CharacterResource {
  return CharacterResource.build({
    id: dto.id,
    name: dto.name,
    current: dto.current,
    max: dto.max,
    shortRest: !!dto.shortRest,
  });
}

export function convertResourceDbModel(
  model: CharacterResource
): CharacterResourceDto {
  return {
    id: model.getDataValue("id"),
    name: model.getDataValue("name"),
    current: model.getDataValue("current"),
    max: model.getDataValue("max"),
    shortRest: model.getDataValue("shortRest"),
  };
}
