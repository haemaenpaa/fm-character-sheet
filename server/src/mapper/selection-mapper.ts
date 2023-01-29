import { AoSelectionDto } from "fm-transfer-model";
import { AoSelection } from "../model/ao-selection";

export function convertSelectionDto(dto: AoSelectionDto): AoSelection {
  return AoSelection.build({
    id: dto.id!,
    name: dto.name || "UNKNOWN",
    abilityOrigin: dto.abilityOrigin || "Artistry",
    level: dto.abilityOrigin || 0,
    description: dto.description || "",
    hilightColor: dto.hilightColor,
    isPrimary: !!dto.isPrimary,
    takenAtLevel: dto.takenAtLevel || 0,
  });
}

export function convertSelectionDbModel(model: AoSelection): AoSelectionDto {
  return {
    id: model.getDataValue("id"),
    name: model.getDataValue("name"),
    abilityOrigin: model.getDataValue("abilityOrigin"),
    level: model.getDataValue("level"),
    description: model.getDataValue("description"),
    hilightColor: model.getDataValue("hilightColor"),
    isPrimary: model.getDataValue("isPrimary"),
    takenAtLevel: model.getDataValue("takenAtLevel"),
  };
}
