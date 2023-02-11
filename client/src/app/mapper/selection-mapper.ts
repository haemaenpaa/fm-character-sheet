import { AoSelectionDto } from 'fm-transfer-model';
import { AoSelection } from '../model/ao-selection';

export function convertAoSelectionDto(dto: AoSelectionDto): AoSelection {
  return {
    id: dto.id || -1,
    abilityOrigin: dto.abilityOrigin || '',
    level: dto.level || 0,
    name: dto.name || '',
    description: dto.description || '',
    hilightColor: dto.hilightColor,
    isPrimary: !!dto.isPrimary,
    takenAtLevel: dto.takenAtLevel || 0,
  };
}
export function convertAoSelectionModel(model: AoSelection): AoSelectionDto {
  return {
    id: model.id,
    abilityOrigin: model.abilityOrigin,
    level: model.level,
    name: model.name,
    description: model.description,
    hilightColor: model.hilightColor,
    isPrimary: !!model.isPrimary,
    takenAtLevel: model.takenAtLevel,
  };
}
