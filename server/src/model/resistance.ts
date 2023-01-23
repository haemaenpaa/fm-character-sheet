import { DataTypes, Model, ModelAttributes } from "sequelize";

export class Resistance extends Model {}

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
    type: DataTypes.STRING,
    allowNull: false,
  },
};
