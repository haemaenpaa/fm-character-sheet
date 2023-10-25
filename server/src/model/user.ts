import {
  BelongsTo,
  DataTypes,
  HasMany,
  HasOne,
  Model,
  ModelAttributes,
} from "sequelize";
import { Character } from "./character";

export class User extends Model {}
export class UserCharacter extends Model {}

export const UserDef: ModelAttributes<User> = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
  },
  openId: {
    type: DataTypes.STRING,
    primaryKey: false,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailLocal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailHost: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

export const UserCharacterDef: ModelAttributes<UserCharacter> = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
};
