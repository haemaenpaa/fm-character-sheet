import { DataTypes, Model, ModelAttributes } from "sequelize";

export class Race extends Model {}

export class RacialAbility extends Model {}

export const RaceDef: ModelAttributes<Race> = {
  id: {
    type: DataTypes.NUMBER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subRace: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  powerfulBuild: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};
export const RacialAbilityDef: ModelAttributes<RacialAbility> = {
  name: {
    type: DataTypes.STRING,
  },
};
