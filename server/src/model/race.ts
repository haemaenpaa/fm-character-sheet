import {
  BelongsTo,
  DataTypes,
  HasMany,
  Model,
  ModelAttributes,
} from "sequelize";
import { Character } from "./character";
import { RacialResistance } from "./resistance";

export class Race extends Model {
  static Resistances: HasMany<Race, RacialResistance>;
  static Abilities: HasMany<Race, RacialAbility>;
}

export class RacialAbility extends Model {}

export const RaceDef: ModelAttributes<Race> = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
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
  description: {
    type: DataTypes.TEXT,
  },
};
