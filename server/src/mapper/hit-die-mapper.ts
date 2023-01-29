import { CharacterHitDiceDto } from "fm-transfer-model";
import { HitDice, HitDiceRemaining } from "../model/hit-dice";

function extractHitDiceValues(dto: CharacterHitDiceDto) {
  return {
    d6: dto[6],
    d8: dto[8],
    d10: dto[10],
    d12: dto[12],
  };
}

export function convertHitDiceDto(dto: CharacterHitDiceDto): HitDice {
  return HitDice.build(extractHitDiceValues(dto));
}
export function convertHitDiceRemainingDto(
  dto: CharacterHitDiceDto
): HitDiceRemaining {
  return HitDiceRemaining.build(extractHitDiceValues(dto));
}

export function convertHitDiceDbModel(
  model?: HitDice | HitDiceRemaining
): CharacterHitDiceDto | undefined {
  if (!model) {
    return undefined;
  }
  return {
    6: model.getDataValue("d6"),
    8: model.getDataValue("d8"),
    10: model.getDataValue("d10"),
    12: model.getDataValue("d12"),
  };
}
