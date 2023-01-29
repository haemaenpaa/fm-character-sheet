import { DataTypes, Model, ModelAttributes } from "sequelize";

export class CharacterResource extends Model {}

export const CharacterResourceRef: ModelAttributes<CharacterResource> = {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  name: { type: DataTypes.STRING },
  current: { type: DataTypes.NUMBER },
  max: { type: DataTypes.NUMBER },
  shortRest: { type: DataTypes.BOOLEAN },
};
