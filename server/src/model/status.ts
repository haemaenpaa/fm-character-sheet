import { DataTypes, Model, ModelAttributes, HasOne } from "sequelize";
import { Character } from "./character";

export class Status extends Model {}

export class CharacterStatus extends Model {
  static Status: HasOne<Status>;
  static Character: HasOne<Character>;
}

const StatusDef: ModelAttributes<Status> = {
  id: { type: DataTypes.BIGINT, primaryKey: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
};

const CharacterStatusDef: ModelAttributes<CharacterStatus> = {
  id: { type: DataTypes.BIGINT, primaryKey: true },
};
