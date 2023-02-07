import { ResistanceDto } from "fm-transfer-model";
import { Resistance, ResistanceCategory } from "../model/resistance";

export function convertResistanceDto(
  dto: ResistanceDto,
  category: ResistanceCategory
): Resistance {
  return Resistance.build({
    type: dto.type || "resistance",
    value: dto.value || "UNKNOWN",
    category,
  });
}
export function convertResistanceDbModel(model: Resistance): ResistanceDto {
  return {
    type: model.getDataValue("type"),
    value: model.getDataValue("value"),
  };
}
