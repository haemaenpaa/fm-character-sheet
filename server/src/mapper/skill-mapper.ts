import { SkillDto } from "fm-transfer-model";
import { CustomSkill } from "../model/custom-skill";

export function convertSkillDto(dto: SkillDto): CustomSkill {
  return CustomSkill.build({
    id: dto.identifier,
    name: dto.name,
    rank: dto.rank,
    defaultAbilities: dto.defaultAbilities?.join(","),
  });
}

export function convertSkillDbModel(model: CustomSkill): SkillDto {
  const abilitiesString = model.getDataValue("defaultAbilities");

  var defaultAbilities = [];
  if (abilitiesString) {
    defaultAbilities = abilitiesString?.split(",");
  }
  return {
    identifier: model.getDataValue("id"),
    name: model.getDataValue("name"),
    rank: model.getDataValue("rank"),
    defaultAbilities: defaultAbilities,
  };
}
