import { DataTypes, ModelAttributes } from "sequelize";

export const DamageRollDef: ModelAttributes = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  dieCount: {
    type: DataTypes.NUMBER,
    defaultValue: 1,
  },
  dieSize: {
    type: DataTypes.NUMBER,
    defaultValue: 4,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
