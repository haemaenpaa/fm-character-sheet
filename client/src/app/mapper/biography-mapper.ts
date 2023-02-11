import { CharacterBiographyDto } from 'fm-transfer-model';
import { CharacterBiography } from '../model/character-bio';

export function convertBiographyDto(
  dto: CharacterBiographyDto
): CharacterBiography {
  return {
    id: dto.id || -1,
    concept: dto.concept,
    appearance: dto.appearance || '',
    soulMarkDescription: dto.soulMarkDescription,
    characterBiography: dto.characterBiography || '',
    characterConnections: dto.characterConnections || '',
    height: dto.height || 0,
    weight: dto.weight || 0,
  };
}

export function convertBiographyModel(
  model: CharacterBiography
): CharacterBiographyDto {
  return {
    id: model.id,
    concept: model.concept,
    appearance: model.appearance,
    soulMarkDescription: model.soulMarkDescription,
    characterBiography: model.characterBiography,
    characterConnections: model.characterConnections,
    height: model.height,
    weight: model.weight,
  };
}
