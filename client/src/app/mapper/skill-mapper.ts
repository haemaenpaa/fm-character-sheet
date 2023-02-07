import { SkillDto } from 'fm-transfer-model';
import { Skill } from '../model/skill';

export function convertSkillModel(skill: Skill): SkillDto {
  return {
    identifier: skill.identifier,
    name: skill.name,
    rank: skill.rank,
    defaultAbilities: [...skill.defaultAbilities],
  };
}

export function convertSkillDto(skill: SkillDto): Skill {
  return {
    identifier: skill.identifier || '',
    name: skill.name || '',
    rank: skill.rank || 0,
    defaultAbilities: skill.defaultAbilities ? [...skill.defaultAbilities] : [],
  };
}
