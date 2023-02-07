import { DataTypes, Model, ModelAttributes } from "sequelize";

export type ResistanceCategory = "damage" | "status";

export class Resistance extends Model {}
export class RacialResistance extends Model {}

export const ResistanceDef: ModelAttributes<Resistance> = {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("damage", "status"),
    allowNull: false,
  },
};
