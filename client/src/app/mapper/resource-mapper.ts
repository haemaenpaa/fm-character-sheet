import { CharacterResourceDto } from 'fm-transfer-model';
import { CharacterResource } from '../model/character-resource';

export function convertResourceModel(
  model: CharacterResource
): CharacterResourceDto {
  return {
    id: model.id,
    name: model.name,
    current: model.current,
    max: model.max,
    shortRest: model.shortRest,
  };
}

export function convertResourceDto(
  dto: CharacterResourceDto
): CharacterResource {
  return {
    id: dto.id || -1,
    name: dto.name || '',
    current: dto.current || 0,
    max: dto.max || 0,
    shortRest: !!dto.shortRest,
  };
}
