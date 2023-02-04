import { AttackEffectDto, CharacterAttackDto } from 'fm-transfer-model';
import CharacterAttack, { AttackEffect } from '../model/character-attack';
import { randomId } from '../model/id-generator';
import {
  convertDamageRollDto,
  convertDamageRollModel,
} from './damage-roll-mapper';

export function convertAttackDto(atk: CharacterAttackDto): CharacterAttack {
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
}
export function convertAttackModel(model: CharacterAttack): CharacterAttackDto {
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

function convertAttackEffectDto(dto: AttackEffectDto): AttackEffect {
  return {
    id: dto.id || randomId(),
    dv: dto.dv,
    save: dto.save,
    description: dto.description || '',
  };
}
