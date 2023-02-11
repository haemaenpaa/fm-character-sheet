import { CharacterHitDiceDto } from 'fm-transfer-model';
import CharacterHitDice from '../model/character-hit-dice';

export function convertHitDiceDto(dto: CharacterHitDiceDto): CharacterHitDice {
  return {
    6: dto[6] || 0,
    8: dto[8] || 0,
    10: dto[10] || 0,
    12: dto[12] || 0,
  };
}

export function convertHitDiceModel(
  model: CharacterHitDice
): CharacterHitDiceDto {
  const ret: CharacterHitDice = {
    6: model[6],
    8: model[8],
    10: model[10],
    12: model[12],
  };
  return ret;
}
