import { BelongsTo, DataTypes, Model, ModelAttributes } from "sequelize";
import { Character } from "./character";

export class AoSelection extends Model {
  static Character: BelongsTo<AoSelection, Character>;
}

export const AoSelectionDef: ModelAttributes<AoSelection> = {
  id: {
    type: DataTypes.NUMBER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abilityOrigin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hilightColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  takenAtLevel: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
};
