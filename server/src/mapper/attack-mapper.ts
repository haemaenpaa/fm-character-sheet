import {
  AttackEffectDto,
  CharacterAttackDto,
  DamageRollDto,
} from "fm-transfer-model";
import { Attack, AttackDamage, AttackEffect } from "../model/attack";

export function convertAttackDto(dto: CharacterAttackDto): Attack {
  return Attack.build({
    id: dto.id!,
    name: dto.name,
    range: dto.range,
    abilities: dto.abilities ? dto.abilities.join(",") : "",
    proficient: !!dto.proficient,
    attackBonus: dto.attackBonus || 0,
    offhand: !!dto.offhand,
    damage: dto.damage?.map(convertDamageDto),
    effect: dto.effects?.map(convertEffectDto),
  });
}

export function convertAttackDbModel(model: Attack) {
  const modelDamage = model.getDataValue("damage") as AttackDamage[];
  const damage = modelDamage.map(convertDamageDbModel);
  const ret: CharacterAttackDto = {
    id: model.getDataValue("id"),
    name: model.getDataValue("name"),
    range: model.getDataValue("range"),
    abilities: model.getDataValue("abilities")?.split(",") || [],
    proficient: !!model.getDataValue("proficient"),
    attackBonus: model.getDataValue("attackBonus"),
    offhand: !!model.getDataValue("offhand"),
    damage,
  };
  return ret;
}

function convertDamageDbModel(model: AttackDamage): DamageRollDto {
  return {
    id: model.getDataValue("id"),
    dieCount: model.getDataValue("dieCount"),
    dieSize: model.getDataValue("dieSize"),
    type: model.getDataValue("type"),
  };
}

function convertEffectDbModel(model: AttackEffect): AttackEffectDto {
  return {
    id: model.getDataValue("id"),
    save: model.getDataValue("save"),
    dv: model.getDataValue("dv"),
    description: model.getDataValue("description"),
  };
}

function convertDamageDto(dto: DamageRollDto): AttackDamage {
  return AttackDamage.build({
    id: dto.id,
    dieCount: dto.dieCount,
    dieSize: dto.dieSize,
    type: dto.type,
  });
}

function convertEffectDto(dto: AttackEffectDto): AttackEffect {
  return AttackEffect.build({
    id: dto.id,
    save: dto.save,
    dv: dto.dv,
    description: dto.description,
  });
}