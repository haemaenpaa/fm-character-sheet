import { BelongsTo, DataTypes, Model, ModelAttributes } from "sequelize";
import { Character } from "./character";

export class CharacterBio extends Model {
  static Character: BelongsTo<CharacterBio, Character>;
}

export const CharacterBioDef: ModelAttributes<CharacterBio> = {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  concept: { type: DataTypes.STRING },
  appearance: { type: DataTypes.TEXT("long") },
  soulMarkDescription: { type: DataTypes.TEXT("long") },
  characterBiography: { type: DataTypes.TEXT("long") },
  characterConnections: { type: DataTypes.TEXT("long") },
  height: { type: DataTypes.NUMBER },
  weight: { type: DataTypes.NUMBER },
};
