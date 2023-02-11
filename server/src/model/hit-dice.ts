import { DataTypes, Model, ModelAttributes } from "sequelize";

export class HitDice extends Model {}
export class HitDiceRemaining extends Model {}

export const HitDiceDef: ModelAttributes = {
  d6: { type: DataTypes.NUMBER },
  d8: { type: DataTypes.NUMBER },
  d10: { type: DataTypes.NUMBER },
  d12: { type: DataTypes.NUMBER },
};
