import { DataTypes } from "sequelize";

export const DamageRollDef = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
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
