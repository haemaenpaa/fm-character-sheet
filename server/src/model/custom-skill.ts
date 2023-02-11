import { BelongsTo, DataTypes, Model, ModelAttributes } from "sequelize";
import { Character } from "./character";

export class CustomSkill extends Model {
  static Character: BelongsTo<CustomSkill, Character>;
}

export const CustomSkillDef: ModelAttributes<CustomSkill> = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rank: {
    type: DataTypes.NUMBER,
    defaultValue: 0,
  },
  /**
   * Comma-separated list of default abilities.
   */
  defaultAbilities: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
