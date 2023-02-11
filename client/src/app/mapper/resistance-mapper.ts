import { ResistanceDto } from 'fm-transfer-model';
import Resistance, { ResistanceType } from '../model/resistance';

export function convertResistanceDto(dto: ResistanceDto): Resistance {
  return {
    type: (dto.type as ResistanceType) || 'resistance',
    value: dto.value || '?',
  };
}
export function convertResistanceModel(model: Resistance): ResistanceDto {
  return {
    type: model.type,
    value: model.value,
  };
}
